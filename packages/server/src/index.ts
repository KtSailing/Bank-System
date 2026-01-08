// packages/server/src/index.ts
import express from 'express';
import cors from 'cors';
import { sequelize } from './models';
import routes from './routes'; // 追加

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// APIルートの適用（プレフィックスとして /api をつける）
app.use('/api', routes); // 追加

// packages/server/src/index.ts

// ... (import文などはそのまま)

const startServer = async () => {
  try {
    console.log('1. DB同期を開始します...'); // 追加
    await sequelize.sync({ force: false }); 
    console.log('2. DB同期が完了しました！'); // 追加

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  }
};

// ファイルの最後で必ず呼び出す
console.log('0. スクリプト読み込み完了'); // 追加
startServer();