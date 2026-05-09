import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Connects to backend server
});

// Request interceptor to attach JWT
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
