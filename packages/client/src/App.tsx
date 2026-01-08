import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Expressサーバー(ポート4000)へリクエスト
    fetch('http://localhost:4000/')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bank System Client</h1>
      <p>Server Status: {message ? `✅ ${message}` : 'Loading...'}</p>
    </div>
  );
}

export default App;