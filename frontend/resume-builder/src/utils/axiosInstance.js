import axios from 'axios';
import { BASE_URL } from './apiPath';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: Number(import.meta.env.VITE_HTTP_TIMEOUT ?? 30000),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(cfg => {
  const raw = localStorage.getItem('token');
  if (raw) {
    // Strip accidental quotes / Bearer duplications
    const token = raw.replace(/^"|"$/g,'').replace(/^Bearer\s+/i,'');
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
},
(error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if(error.response.status === 401) {
        window.location.href = '/';
      }else if(error.response.status === 500){
        console.error('Server error:', error.response.data);
      }
    } else if(error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.message);
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
