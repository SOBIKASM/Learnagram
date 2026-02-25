import axios from 'axios';

// For Vite, use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs - make sure these are exported correctly
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getUser: (userId) => api.get(`/users/${userId}`),
};

// Posts APIs (you'll create these later)
export const postsAPI = {
  getFeed: () => api.get('/posts/feed'),
  createPost: (postData) => api.post('/posts', postData),
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  commentOnPost: (postId, comment) => api.post(`/posts/${postId}/comment`, { comment }),
};

// Also export api as default if needed
export default api;