import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [myAccountId, setMyAccountId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userJson = localStorage.getItem('user');
      if (!userJson) return navigate('/login');
      const user = JSON.parse(userJson);

      try {
        // 1. まず自分の口座IDを取得
        const accountRes = await api.get(`/users/${user.id}/account`);
        const accountId = accountRes.data.id;
        setMyAccountId(accountId);

        // 2. そのIDを使って履歴を取得
        const historyRes = await api.get(`/accounts/${accountId}/transactions`);
        setTransactions(historyRes.data);
      } catch (err) {
        console.error('履歴取得失敗', err);
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>取引履歴</h2>
        <button onClick={() => navigate('/dashboard')}>戻る</button>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>日時</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>内容</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>金額</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => {
            // 自分が送金元(From)なら「出金」、送金先(To)なら「入金」
            const isOutgoing = tx.fromAccountId === myAccountId;
            const date = new Date(tx.createdAt).toLocaleString();
            
            return (
              <tr key={tx.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd', fontSize: '0.9rem' }}>{date}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {tx.type === 'TRANSFER' ? (isOutgoing ? '振込送金' : '振込入金') : tx.type}
                </td>
                <td style={{ 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  textAlign: 'right',
                  color: isOutgoing ? 'red' : 'green',
                  fontWeight: 'bold'
                }}>
                  {isOutgoing ? '-' : '+'}{tx.amount.toLocaleString()}
                </td>
              </tr>
            );
          })}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: '20px', textAlign: 'center' }}>履歴はありません</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};