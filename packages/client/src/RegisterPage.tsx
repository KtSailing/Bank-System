import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      alert('登録完了！ログイン画面へ移動します。');
      navigate('/login');
    } catch (err) {
      alert('登録失敗: すでに使われているメールアドレスかもしれません');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>新規口座開設 (ユーザー登録)</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '10px' }}>
          <label>Name: </label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email: </label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password: </label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none' }}>Register</button>
      </form>
      <p style={{ marginTop: '10px' }}>
        <Link to="/login">ログイン画面へ戻る</Link>
      </p>
    </div>
  );
};