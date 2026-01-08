// packages/server/src/routes/index.ts
import { Router } from 'express';
import { registerUser } from '../controllers/userController';
import { createAccount, getAccount, getAccountTransactions } from '../controllers/accountController';
import { transferMoney } from '../controllers/transferController'; // 追加

const router = Router();



router.post('/users', registerUser);
router.post('/accounts', createAccount);

// 送金 API を追加
// POST http://localhost:4000/api/transfer
router.post('/transfer', transferMoney);

// 口座情報の取得 (GET /api/accounts/1)
router.get('/accounts/:id', getAccount);

// 取引履歴の取得 (GET /api/accounts/1/transactions)
router.get('/accounts/:id/transactions', getAccountTransactions);

export default router;