const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_BASE = API_URL.replace(/\/api(?:\/.*)?$/, '');

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) return path;
  if (path.startsWith('/uploads/')) return `${API_BASE}${path}`;
  return path;
};

export default getImageUrl;
