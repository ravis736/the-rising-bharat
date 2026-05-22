import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let csrfToken = null;

const getCsrfToken = async () => {
  try {
    const { data } = await api.get('/csrf-token');
    csrfToken = data.csrfToken;
    return csrfToken;
  } catch {
    return null;
  }
};

api.interceptors.request.use(async (config) => {
  if (config.method !== 'get' && config.method !== 'GET' && !config.url.includes('/csrf-token')) {
    if (!csrfToken) {
      await getCsrfToken();
    }
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && error.response?.data?.message === 'Invalid CSRF token') {
      csrfToken = null;
      const newToken = await getCsrfToken();
      if (newToken && error.config) {
        error.config.headers['X-CSRF-Token'] = newToken;
        return api(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
