import axios from 'axios';

const client = axios.create({ baseURL: '/api' });

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.detail || err.message || 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export default client;
