// packages/client/src/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 修正: async関数を中で定義して呼ぶ
    const initDashboard = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      try {
        const res = await api.get(`/users/${userData.id}/account`);
        setAccount(res.data);
      } catch (err) {
        console.error('口座取得エラー', err);
      }
    };

    initDashboard(); // 定義した関数を実行
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <header className="flex-between" style={{ marginBottom: '20px' }}>
        <h1>Bank App</h1>
        <button onClick={handleLogout} className="secondary" style={{ width: 'auto', padding: '8px 16px' }}>
          Logout
        </button>
      </header>
      
      <div className="card">
        <p style={{ color: 'var(--text-sub)' }}>Welcome, {user.name}</p>
        
        {account ? (
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>ACCOUNT NUMBER</p>
            <p style={{ fontSize: '1.5rem', fontFamily: 'monospace', letterSpacing: '2px' }}>
              {account.accountNumber}
            </p>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)', marginTop: '20px' }}>CURRENT BALANCE</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)', margin: '0' }}>
              ¥{account.balance.toLocaleString()}
            </p>
          </div>
        ) : (
          <p>Loading account info...</p>
        )}
      </div>

      <div className="mt-20" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
        {/* ボタンを3つ並べるスタイルに変更しました */}
        <button onClick={() => navigate('/deposit')} style={{ backgroundColor: 'var(--success)' }}>入金する</button>
        <button onClick={() => navigate('/transfer')}>送金する</button>
        <button onClick={() => navigate('/history')} className="secondary">取引履歴</button>
      </div>
    </div>
  );
};