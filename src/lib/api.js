import axios from 'axios';
import { auth } from './firebase.js';

const API_BASE_URL = 'http://localhost:8000/api'; // Local FastAPI URL

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to attach the Firebase ID token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
