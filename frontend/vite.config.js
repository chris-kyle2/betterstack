import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    global: 'window',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
});
const Login = React.lazy(() => import('./pages/auth/Login.jsx'));
const SignUp = React.lazy(() => import('./pages/auth/SignUp.jsx'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword.jsx'));
const EndpointsList = React.lazy(() => import('./pages/endpoints/EndpointsList.jsx'));
const EndpointDetail = React.lazy(() => import('./pages/endpoints/EndpointDetail.jsx'));
const LogsList = React.lazy(() => import('./pages/logs/LogsList.jsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'));