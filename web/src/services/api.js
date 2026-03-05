import axios from 'axios';

const API_BASE_URL = 'http://localhost:7001/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request interceptor - Token:', token ? 'Present' : 'Not found');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', config.headers.Authorization);
    }
    
    console.log('Making request to:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.log('Unauthorized - clearing storage and redirecting');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const classroomAPI = {
  getClassrooms: () => api.get('/classrooms'),
  getClassroom: (classId) => api.get(`/classrooms/${classId}`),
  createClassroom: (data) => api.post('/classrooms', data),
  joinClassroom: (classId) => api.post(`/classrooms/${classId}/join`),
  getMessages: (classId) => api.get(`/classrooms/${classId}/messages`),
  sendMessage: (classId, text) => api.post(`/classrooms/${classId}/messages`, { text }),
};

export default api;
