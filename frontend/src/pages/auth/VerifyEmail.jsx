import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { confirmSignUp, resendConfirmationCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, username } = location.state || {};

  const methods = useForm({
    defaultValues: {
      code: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    if (!username) {
      navigate('/signup');
      return;
    }

    setIsLoading(true);
    try {
      await confirmSignUp(username, data.code);
      navigate('/login');
    } catch (error) {
      console.error('Verification error:', error);
      if (error.code === 'ExpiredCodeException') {
        toast.error('Verification code has expired. Please request a new one.');
      } else if (error.code === 'CodeMismatchException') {
        toast.error('Invalid verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!username) return;
    
    setIsResending(true);
    try {
      await resendConfirmationCode(username);
      toast.success('New verification code sent!');
    } catch (error) {
      console.error('Resend error:', error);
    } finally {
      setIsResending(false);
    }
  };

  if (!email || !username) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Email Required</h2>
        <p className="mt-2 text-gray-400">Please sign up first</p>
        <Link to="/signup" className="mt-4 inline-block text-primary-500 hover:text-primary-400">
          Go to Sign Up
        </Link>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Verify your email</h2>
          <p className="mt-2 text-sm text-gray-400">
            We sent a verification code to {email}
          </p>
        </div>

        <FormInput
          label="Verification Code"
          name="code"
          required
          error={methods.formState.errors.code?.message}
          placeholder="Enter the 6-digit code"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          icon={Mail}
          className="mt-6"
        >
          Verify Email
        </Button>

        <div className="text-center mt-4 space-y-2">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            isLoading={isResending}
            icon={RefreshCw}
            onClick={handleResendCode}
          >
            Resend Verification Code
          </Button>
          
          <div className="text-sm text-gray-400">
            Didn't receive the code?{' '}
            <Link to="/signup" className="font-medium text-primary-500 hover:text-primary-400">
              Sign up again
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default VerifyEmail; 