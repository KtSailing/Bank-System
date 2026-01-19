// packages/client/src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// ■ リクエストのログ出力設定
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Safariのコンソールに見やすく表示
  console.groupCollapsed(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`);
  console.log('Headers:', config.headers);
  console.log('Body:', config.data); // 送信するデータ
  console.groupEnd();

  return config;
});

// ■ レスポンス（返信）のログ出力設定
api.interceptors.response.use(
  (response) => {
    // 成功時
    console.groupCollapsed(`✅ Response: ${response.status} ${response.config.url}`);
    console.log('Data:', response.data); // サーバーから来たデータ
    console.groupEnd();
    return response;
  },
  (error) => {
    // エラー時
    console.group(`❌ Error: ${error.config?.url}`);
    if (error.response) {
      // サーバーがエラーを返した場合 (400, 500など)
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      // 通信自体が失敗した場合
      console.log('Message:', error.message);
    }
    console.groupEnd();
    return Promise.reject(error);
  }
);

export default api;