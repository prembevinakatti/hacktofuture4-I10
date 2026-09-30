// Centralized API Base URL configuration
// In development, defaults to http://localhost:5000
// When backend is deployed, set VITE_API_URL in .env or Vercel environment variables
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://jansetu-sekx.onrender.com').replace(/\/$/, '');
export default API_BASE_URL;
