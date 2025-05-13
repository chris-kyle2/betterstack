import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-dark-800 px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-warning-500 mb-6" />
      <h1 className="text-4xl font-bold text-white">404</h1>
      <p className="mt-2 text-xl font-semibold text-white">Page not found</p>
      <p className="mt-4 text-gray-400 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" className="mt-8">
          Go back to dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;