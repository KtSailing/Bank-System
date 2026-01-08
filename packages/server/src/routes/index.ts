// packages/server/src/routes/index.ts
import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { 
  createAccount, 
  getAccount, 
  getAccountTransactions,
  getUserAccount // 追加インポート
} from '../controllers/accountController';
import { transferMoney } from '../controllers/transferController';

const router = Router();

// 認証系
router.post('/auth/register', register); // URLを変更しました
router.post('/auth/login', login);       // 追加

// 口座・取引系 (本来はここに認証ミドルウェアを挟みますが、まずは疎通優先)
router.get('/accounts/:id', getAccount);
router.get('/accounts/:id/transactions', getAccountTransactions);
router.post('/transfer', transferMoney);

// 追加: ユーザーIDから口座を取得するルート
router.get('/users/:userId/account', getUserAccount);

export default router;