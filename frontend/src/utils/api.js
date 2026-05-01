// Determine the base URL dynamically based on environment
const BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000'
  : import.meta.env.VITE_API_URL; // This comes from .env.production

export default BASE_URL;
