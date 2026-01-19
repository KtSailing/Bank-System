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
      alert('登録完了！ログインしてください');
      navigate('/login');
    } catch (err) {
      alert('登録失敗');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>新規口座開設</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={{ backgroundColor: 'var(--success)' }}>Register</button>
        </form>
        <p className="mt-20" style={{ textAlign: 'center' }}>
          <Link to="/login">ログイン画面へ戻る</Link>
        </p>
      </div>
    </div>
  );
};