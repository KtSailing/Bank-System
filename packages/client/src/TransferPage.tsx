import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export const TransferPage = () => {
  const navigate = useNavigate();
  const [myAccount, setMyAccount] = useState<any>(null);
  
  // フォーム入力値
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');

  // マウント時に自分の口座情報を取得（送金元IDが必要なため）
  useEffect(() => {
    const fetchMyAccount = async () => {
      const userJson = localStorage.getItem('user');
      if (!userJson) return navigate('/login');
      const user = JSON.parse(userJson);

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
    if (!window.confirm(`${amount}円を送金しますか？`)) return;

    try {
      await api.post('/transfer', {
        fromAccountId: myAccount.id, // 自分のDB上のID
        toAccountNumber: toAccountNumber, // 相手の口座番号
        amount: Number(amount)
      });
      alert('送金が完了しました！');
      navigate('/dashboard');
    } catch (err: any) {
      // エラーメッセージを表示
      const msg = err.response?.data?.error || '送金に失敗しました';
      alert(`エラー: ${msg}`);
    }
  };

  if (!myAccount) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>送金</h2>
      <p>現在の残高: <strong>¥{myAccount.balance.toLocaleString()}</strong></p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>送金先 口座番号</label>
          <input 
            type="text" 
            value={toAccountNumber} 
            onChange={e => setToAccountNumber(e.target.value)} 
            placeholder="例: 1234567890"
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>送金金額 (円)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            placeholder="例: 1000"
            min="1"
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          送金実行
        </button>
      </form>
      
      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>
        &lt; ダッシュボードに戻る
      </button>
    </div>
  );
};