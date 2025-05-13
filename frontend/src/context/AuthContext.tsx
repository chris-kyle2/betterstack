import React, { createContext, useState, useEffect, useContext } from 'react';
import { Auth } from 'aws-amplify';
import { toast } from 'sonner';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, attributes: any) => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (email: string, code: string, password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await Auth.signIn(email, password);
      setUser(user);
      setIsAuthenticated(true);
      toast.success('Successfully logged in');
      return user;
    } catch (error: any) {
      let errorMessage = 'Failed to login';
      if (error.code === 'UserNotConfirmedException') {
        errorMessage = 'Please confirm your account';
      } else if (error.code === 'NotAuthorizedException') {
        errorMessage = 'Incorrect username or password';
      } else if (error.code === 'UserNotFoundException') {
        errorMessage = 'User does not exist';
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, attributes: any) => {
    setIsLoading(true);
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes,
      });
      toast.success('Sign up successful. Please check your email for confirmation code.');
      return user;
    } catch (error: any) {
      let errorMessage = 'Failed to sign up';
      if (error.code === 'UsernameExistsException') {
        errorMessage = 'An account with this email already exists';
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Failed to log out');
      console.error('Logout error:', error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await Auth.forgotPassword(email);
      toast.success('Password reset code sent to your email');
    } catch (error) {
      toast.error('Failed to send reset code');
      throw error;
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      await Auth.forgotPasswordSubmit(email, code, newPassword);
      toast.success('Password has been reset successfully');
    } catch (error) {
      toast.error('Failed to reset password');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-dark-700">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};