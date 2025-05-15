import axios from 'axios';
import { Auth } from 'aws-amplify';

// Set base URL from environment variable
//@ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('Using API URL:', API_BASE_URL); // Debug log

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(async (config) => {
  try {
    console.log('Making request to:', `${config.baseURL}${config.url}`);
    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (error) {
    console.error('Auth error:', error);
    return config;
  }
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  async (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export default api;