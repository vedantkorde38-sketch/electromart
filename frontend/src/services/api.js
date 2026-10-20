import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to inject Authorization JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('electromart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error extracting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired, clear invalid auth from storage
    if (error.response && error.response.status === 401) {
      const msg = error.response.data?.message || '';
      if (msg.includes('expired') || msg.includes('invalid') || msg.includes('no token')) {
        localStorage.removeItem('electromart_token');
        localStorage.removeItem('electromart_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
