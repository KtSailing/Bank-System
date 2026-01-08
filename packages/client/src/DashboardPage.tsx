import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login'); // ログインしてなければ飛ばす
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    // 本当は「自分の口座を取得するAPI」を作るべきですが、
    // ここでは簡易的に「口座ID = ユーザーID」と仮定して叩いてみます
    // ※Step 1-1で登録時にAccountも作っているので、ユーザーIDに対応する口座があるはずです
    // 正確には: GET /api/users/:userId/accounts などが必要
    fetchAccountData(userData.id); 
  }, [navigate]);

  const fetchAccountData = async (userId: number) => {
    try {
      // 本来は口座IDが必要ですが、今回は便宜上ID=1の口座などを直接指定するのではなく
      // サーバー側で「ユーザーIDから口座を引く」実装に変えるのが本来の姿です。
      // 現状のAPI仕様に合わせ、クライアント側で口座を検索する処理は複雑になるため、
      // ここでは仮実装として「ユーザーIDと同じIDの口座」を取得してみます。
      // (※前回のUser A = Account 1, User B = Account 2 のような連番の偶然に頼る形です)
      
      const res = await api.get(`/accounts/${userId}`);
      setAccount(res.data);
    } catch (err) {
      console.error('口座情報の取得に失敗', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Bank Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
        <h2>ようこそ、{user.name} さん</h2>
        {account ? (
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '1.2rem' }}>口座番号: <strong>{account.accountNumber}</strong></p>
            <p style={{ fontSize: '2rem', color: '#28a745' }}>
              残高: ¥{account.balance.toLocaleString()}
            </p>
          </div>
        ) : (
          <p>口座情報を読み込み中、または口座が見つかりません...</p>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>操作メニュー</h3>
        <button style={{ marginRight: '10px' }} onClick={() => alert('送金画面へ (未実装)')}>送金する</button>
        <button onClick={() => alert('履歴画面へ (未実装)')}>取引履歴を見る</button>
      </div>
    </div>
  );
};