import axios from 'axios';

console.log("process.env.REACT_APP_API_BASE_URL", process.env.REACT_APP_API_BASE_URL)
// Create an Axios instance with base config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Modify config before request is sent (e.g., add authorization token)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // You can customize logging or transformations here
    console.log('Starting Request', config);
    
    return config;
  },
  error => {
    // Handle request error globally
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    // Optionally transform response data here
    return response;
  },
  error => {
    // Handle errors globally (status codes outside 2xx)
    if (error.response) {
      // Server responded with status other than 2xx
      if (error.response.status === 401) {
        // Possibly redirect to login or refresh token
        console.error('Unauthorized - need to login');
      }
      // You can handle other status codes like 403, 500, etc.
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Setup request triggered an error
      console.error('Axios setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
