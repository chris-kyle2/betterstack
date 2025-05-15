import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import VerifyEmail from './pages/auth/VerifyEmail.jsx';

// Lazy load pages to improve initial load performance
const Login = React.lazy(() => import('./pages/auth/Login.jsx'));
const SignUp = React.lazy(() => import('./pages/auth/SignUp.jsx'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword.jsx'));

const EndpointsList = React.lazy(() => import('./pages/endpoints/EndpointsList.jsx'));
const EndpointDetail = React.lazy(() => import('./pages/endpoints/EndpointDetail.jsx'));
const LogsList = React.lazy(() => import('./pages/logs/LogsList.jsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'));

const App = () => {
  return (
    <AuthProvider>
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center bg-dark-700">
          <LoadingSpinner size="large" />
        </div>
      }>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            
            <Route path="/endpoints" element={<EndpointsList />} />
            <Route path="/endpoints/:id" element={<EndpointDetail />} />
            <Route path="/logs/:endpointId?" element={<LogsList />} />
            
          </Route>

          {/* Redirect root to dashboard if authenticated, otherwise login */}
          <Route path="/" element={<Navigate to="/endpoints" replace />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default App;