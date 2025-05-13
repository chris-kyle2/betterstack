import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { KeyRound, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('email');
  const { forgotPassword, resetPassword } = useAuth();
  
  const methods = useForm({
    defaultValues: {
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSendCode = async (data) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setStep('reset');
    } catch (error) {
      console.error('Error sending code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      methods.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (data.email && data.code && data.newPassword) {
        await resetPassword(data.email, data.code, data.newPassword);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(step === 'email' ? onSendCode : onResetPassword)} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Forgot your password?</h2>
          <p className="mt-2 text-sm text-gray-400">
            {step === 'email' 
              ? "We'll send you a code to reset your password" 
              : "Enter the code sent to your email and your new password"}
          </p>
        </div>

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={step === 'reset'}
          error={methods.formState.errors.email?.message}
        />

        {step === 'reset' && (
          <>
            <FormInput
              label="Verification Code"
              name="code"
              required
              error={methods.formState.errors.code?.message}
            />

            <FormInput
              label="New Password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              error={methods.formState.errors.newPassword?.message}
              helperText="Must be at least 8 characters"
            />

            <FormInput
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              error={methods.formState.errors.confirmPassword?.message}
            />
          </>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          icon={KeyRound}
        >
          {step === 'email' ? 'Send Reset Code' : 'Reset Password'}
        </Button>

        <div className="text-center mt-4">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-400">
            <ArrowLeft size={16} className="mr-2" />
            Back to sign in
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

export default ForgotPassword;