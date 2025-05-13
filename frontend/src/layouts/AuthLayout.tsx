import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-dark-800">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 text-primary-500">
          <Activity size={32} />
          <span className="text-2xl font-bold">PulseMonitor</span>
        </div>
        <p className="text-gray-400 mt-2">Endpoint Monitoring System</p>
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-dark-700 py-8 px-6 shadow-md rounded-lg border border-dark-600 sm:px-10 animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;