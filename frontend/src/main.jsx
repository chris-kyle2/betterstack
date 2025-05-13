import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Amplify } from 'aws-amplify';
import App from './App.jsx';
import { awsConfig } from './config/aws-config.js';
import { Toaster } from 'sonner';
import './index.css';

// Configure Amplify
Amplify.configure(awsConfig);

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'bg-dark-600 text-white border border-dark-400',
            duration: 4000,
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);