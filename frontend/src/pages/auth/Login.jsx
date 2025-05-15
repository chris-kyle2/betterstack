import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { LogIn, Activity, Globe, BarChart3 } from 'lucide-react';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const methods = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/endpoints');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-dark-800 overflow-auto">
      <div className="flex flex-col lg:flex-row h-full w-full">
        {/* Left Column - Description */}
        <div className="w-full lg:w-1/2 bg-dark-600">
          <div className="h-full p-6 sm:p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-2 text-primary-500 mb-6 sm:mb-8">
                <Activity size={32} className="sm:size-40" />
                <h1 className="text-2xl sm:text-4xl font-bold">PulseMonitor</h1>
              </div>
              <h2 className="text-xl sm:text-3xl font-semibold text-white mb-4 sm:mb-6">Decentralized Multi-Region Monitoring</h2>
              <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8">
                PulseMonitor leverages AWS Lambda functions deployed across multiple regions to provide comprehensive endpoint monitoring. This distributed architecture ensures reliable and resilient tracking of your web services and APIs, eliminating single points of failure.
              </p>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg sm:text-xl text-white font-medium mb-1 sm:mb-2">Multi-Region Monitoring</h3>
                    <p className="text-gray-400 text-sm sm:text-base">AWS Lambda functions across different regions work together to monitor your endpoints, ensuring global coverage and high availability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg sm:text-xl text-white font-medium mb-1 sm:mb-2">Serverless Analytics</h3>
                    <p className="text-gray-400 text-sm sm:text-base">Get real-time insights through distributed Lambda functions, providing cost-effective and scalable monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-dark-700">
          <div className="w-full max-w-md p-6 sm:p-8">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Sign in to your account</h2>
                  <p className="mt-2 sm:mt-3 text-gray-400 text-sm sm:text-base">
                    Monitor your endpoints with ease
                  </p>
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
                  autoComplete="current-password"
                  required
                  error={methods.formState.errors.password?.message}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-dark-400 bg-dark-700 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                      Remember me
                    </label>
                  </div>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary-500 hover:text-primary-400"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                  icon={LogIn}
                >
                  Sign in
                </Button>

                <div className="text-center">
                  <span className="text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-primary-500 hover:text-primary-400">
                      Sign up
                    </Link>
                  </span>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;