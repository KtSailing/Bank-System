// packages/client/src/HistoryPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [myAccountId, setMyAccountId] = useState<number | null>(null);

  useEffect(() => {
    // 修正: async関数を中で定義して呼ぶ
    const fetchHistory = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(userStr);
      try {
        // 1. 口座ID取得
        const accountRes = await api.get(`/users/${user.id}/account`);
        setMyAccountId(accountRes.data.id);
        
        // 2. 履歴取得
        const historyRes = await api.get(`/accounts/${accountRes.data.id}/transactions`);
        setTransactions(historyRes.data);
      } catch (err) {
        console.error('履歴取得失敗', err);
      }
    };

    fetchHistory();
  }, [navigate]);

  return (
    <div className="container">
      <div className="card">
        <header className="flex-between">
          <h2>取引履歴</h2>
          <button onClick={() => navigate('/dashboard')} className="secondary" style={{ width: 'auto' }}>戻る</button>
        </header>

        <table>
          <thead>
            <tr>
              <th>日時</th>
              <th>内容</th>
              <th style={{ textAlign: 'right' }}>金額</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => {
              const isOutgoing = tx.fromAccountId === myAccountId;
              return (
                <tr key={tx.id}>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                    {new Date(tx.createdAt).toLocaleDateString()} <br/>
                    {new Date(tx.createdAt).toLocaleTimeString()}
                  </td>
                  <td>
                    {tx.type === 'TRANSFER' ? (isOutgoing ? '振込送金' : '振込入金') : tx.type}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }} className={isOutgoing ? 'text-danger' : 'text-success'}>
                    {isOutgoing ? '-' : '+'}{tx.amount.toLocaleString()}
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>履歴なし</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};