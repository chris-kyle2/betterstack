import React, { createContext, useState, useEffect, useContext } from 'react';
import { Auth } from 'aws-amplify';
import { toast } from 'sonner';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('Checking auth state...');
      const currentUser = await Auth.currentAuthenticatedUser();
      console.log('Current user:', currentUser);
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.log('Auth state check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const user = await Auth.signIn(email, password);
      setUser(user);
      setIsAuthenticated(true);
      toast.success('Successfully logged in');
      return user;
    } catch (error) {
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

  const generateUniqueUsername = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `user_${timestamp}_${random}`;
  };

  const signup = async (email, password, attributes) => {
    setIsLoading(true);
    try {
      // Generate a unique username using the new function
      const username = generateUniqueUsername();

      // Format the attributes according to Cognito requirements
      const userAttributes = {
        email: email.toLowerCase(),
        name: `${attributes.given_name} ${attributes.family_name}`,
        given_name: attributes.given_name,
        family_name: attributes.family_name,
      };

      console.log('Signup with username:', username);

      const { user } = await Auth.signUp({
        username,
        password,
        attributes: userAttributes,
      });
      toast.success('Sign up successful. Please check your email for confirmation code.');
      return { user, username };
    } catch (error) {
      let errorMessage = 'Failed to sign up';
      console.error('Signup error details:', {
        code: error.code,
        message: error.message,
        name: error.name,
        email: email,
        attributes: attributes
      });

      if (error.code === 'UsernameExistsException') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet requirements';
      } else if (error.code === 'InvalidParameterException') {
        if (error.message.includes('email')) {
          errorMessage = `Invalid email format: ${error.message}`;
        } else if (error.message.includes('password')) {
          errorMessage = 'Password must be at least 8 characters long';
        } else if (error.message.includes('name')) {
          errorMessage = 'Name is required';
        } else {
          errorMessage = error.message || 'Invalid parameters provided';
        }
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

  const forgotPassword = async (email) => {
    try {
      await Auth.forgotPassword(email);
      toast.success('Password reset code sent to your email');
    } catch (error) {
      toast.error('Failed to send reset code');
      throw error;
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    try {
      await Auth.forgotPasswordSubmit(email, code, newPassword);
      toast.success('Password has been reset successfully');
    } catch (error) {
      toast.error('Failed to reset password');
      throw error;
    }
  };

  const confirmSignUp = async (username, code) => {
    setIsLoading(true);
    try {
      console.log('Confirming signup for username:', username);
      await Auth.confirmSignUp(username, code);
      toast.success('Email verified successfully. You can now login.');
      return true;
    } catch (error) {
      console.error('Confirmation error details:', {
        code: error.code,
        message: error.message,
        name: error.name,
        username: username
      });

      let errorMessage = 'Failed to verify email';
      if (error.code === 'CodeMismatchException') {
        errorMessage = 'Invalid verification code';
      } else if (error.code === 'ExpiredCodeException') {
        errorMessage = 'Verification code has expired';
      } else if (error.code === 'UserNotFoundException') {
        errorMessage = 'User not found. Please sign up again.';
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmationCode = async (username) => {
    setIsLoading(true);
    try {
      console.log('Resending code for username:', username);
      await Auth.resendSignUp(username);
      toast.success('New verification code sent to your email');
      return true;
    } catch (error) {
      console.error('Resend error details:', {
        code: error.code,
        message: error.message,
        name: error.name,
        username: username
      });

      let errorMessage = 'Failed to resend verification code';
      if (error.code === 'UserNotFoundException') {
        errorMessage = 'User not found';
      } else if (error.code === 'InvalidParameterException') {
        errorMessage = 'Invalid username format';
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
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
        confirmSignUp,
        resendConfirmationCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};