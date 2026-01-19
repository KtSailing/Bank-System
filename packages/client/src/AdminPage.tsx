// packages/client/src/AdminPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

// 表示用の型定義
type TransactionDisplay = {
  id: number;
  type: string;
  amount: number;
  description: string;
  updatedAt: string;
  senderName: string;   // ここを埋めるために追加リクエストが必要
  receiverName: string; // ここを埋めるために追加リクエストが必要
};

export const AdminPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithNPlusOne = async () => {
      try {
        setLoading(true);

        // 1. まず一覧を取得 (1 Request)
        console.log('--- 1. 一覧取得開始 ---');
        const listRes = await api.get('/admin/transactions');
        const rawList = listRes.data;

        // 2. 詳細情報を1件ずつ取得 (N Requests × 2)
        // ここで大量のHTTPリクエストが発生します
        console.log(`--- 2. 詳細取得開始 (${rawList.length}件) ---`);
        
        const detailedList = await Promise.all(rawList.map(async (tx: any) => {
          let senderName = 'System';
          let receiverName = 'Unknown';

          // 送金元情報の取得 (HTTP Request)
          if (tx.fromAccountId) {
            try {
              const res = await api.get(`/accounts/${tx.fromAccountId}`);
              senderName = res.data.user?.name || 'Unknown';
            } catch (e) { /* 無視 */ }
          }

          // 送金先情報の取得 (HTTP Request)
          if (tx.toAccountId) {
            try {
              const res = await api.get(`/accounts/${tx.toAccountId}`);
              receiverName = res.data.user?.name || 'Unknown';
            } catch (e) { /* 無視 */ }
          }

          return {
            id: tx.id,
            type: tx.type,
            amount: tx.amount,
            description: tx.description,
            updatedAt: tx.updatedAt,
            senderName,
            receiverName,
          };
        }));

        setTransactions(detailedList);
      } catch (err) {
        alert('データ取得失敗');
      } finally {
        setLoading(false);
      }
    };

    fetchWithNPlusOne();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <header className="flex-between" style={{ marginBottom: '20px' }}>
        <h2>管理者ダッシュボード</h2>
        <button onClick={() => navigate('/dashboard')} className="secondary" style={{ width: 'auto' }}>
          ユーザー画面へ
        </button>
      </header>

      <div className="card">
        <h3>全取引履歴一覧 (Client-side N+1)</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginBottom: '15px' }}>
          ※コンソールを確認してください。大量のHTTPリクエストが発生しています。
        </p>

        {loading ? (
          <p>Loading details via HTTP requests...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>種類</th>
                <th>送金元 &rarr; 送金先</th>
                <th style={{ textAlign: 'right' }}>金額</th>
                <th>更新日時</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ color: 'var(--text-sub)' }}>{tx.id}</td>
                  <td>{tx.type}</td>
                  <td>
                    {tx.senderName} <br />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>&darr;</span><br />
                    {tx.receiverName}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    ¥{tx.amount.toLocaleString()}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                    {new Date(tx.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};