import axios from 'axios';

// Varsayılan olarak Render URL'i kullan. Localhost'taysak localhost'u kullan.
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const DEFAULT_API_URL = isLocalhost ? 'http://localhost:3001/api' : 'https://ders-oyunlari-api.onrender.com/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});
