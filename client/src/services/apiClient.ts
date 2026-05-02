import axios from 'axios';

// Vercel'deki Environment Variable, yoksai Localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});
