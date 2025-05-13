import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { UserPlus } from 'lucide-react';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const methods = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    mode: 'onChange',
    rules: {
      email: {
        required: 'Email is required',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address',
        },
      },
      password: {
        required: 'Password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters',
        },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        },
      },
      confirmPassword: {
        required: 'Please confirm your password',
        validate: (value) => value === methods.getValues('password') || 'Passwords do not match',
      },
      firstName: {
        required: 'First name is required',
      },
      lastName: {
        required: 'Last name is required',
      },
    },
  });

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      methods.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { username } = await signup(data.email, data.password, {
        given_name: data.firstName,
        family_name: data.lastName,
      });
      navigate('/verify-email', { state: { email: data.email, username } });
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Start monitoring your endpoints
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            required
            error={methods.formState.errors.firstName?.message}
          />
          <FormInput
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            required
            error={methods.formState.errors.lastName?.message}
          />
        </div>

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={methods.formState.errors.email?.message}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          error={methods.formState.errors.password?.message}
          helperText="Must be at least 8 characters"
        />

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          error={methods.formState.errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          icon={UserPlus}
          className="mt-6"
        >
          Sign up
        </Button>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-500 hover:text-primary-400">
              Sign in
            </Link>
          </span>
        </div>
      </form>
    </FormProvider>
  );
};

export default SignUp;