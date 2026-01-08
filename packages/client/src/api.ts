// packages/client/src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// リクエスト送信前に、自動でトークンをヘッダーに付与する設定
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;