// Centralized API Base URL configuration
// Automatically detects local development (localhost / 127.0.0.1) and points to http://localhost:5000
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }
  return 'https://jansetu-sekx.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
