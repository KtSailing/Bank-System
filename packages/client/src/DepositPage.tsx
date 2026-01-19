// packages/client/src/DepositPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export const DepositPage = () => {
  const navigate = useNavigate();
  const [myAccount, setMyAccount] = useState<any>(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchMyAccount = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(userStr);
      try {
        const res = await api.get(`/users/${user.id}/account`);
        setMyAccount(res.data);
      } catch (err) {
        alert('口座情報の取得に失敗しました');
      }
    };

    fetchMyAccount();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm(`${amount}円を入金しますか？`)) return;

    try {
      await api.post('/deposit', {
        accountId: myAccount.id,
        amount: Number(amount)
      });
      alert('入金が完了しました！');
      navigate('/dashboard');
    } catch (err: any) {
      alert(`エラー: ${err.response?.data?.error || '入金失敗'}`);
    }
  };

  if (!myAccount) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="card">
        <header className="flex-between">
          <h2>入金 (ATM)</h2>
          <button onClick={() => navigate('/dashboard')} className="secondary" style={{ width: 'auto' }}>戻る</button>
        </header>

        <p className="mt-20">現在の残高: <strong>¥{myAccount.balance.toLocaleString()}</strong></p>
        
        <form onSubmit={handleSubmit} className="mt-20">
          <div>
            <label>入金金額 (円)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder="例: 10000"
              min="1"
              required 
            />
          </div>

          <button type="submit" style={{ backgroundColor: 'var(--success)' }}>入金実行</button>
        </form>
      </div>
    </div>
  );
};