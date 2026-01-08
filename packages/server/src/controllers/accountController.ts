// packages/server/src/controllers/accountController.ts
import { Op } from 'sequelize';
import { Request, Response } from 'express';
import { Account, Transaction, User } from '../models'; // index経由でインポート推奨

// 簡易的な口座番号生成（ランダムな10桁）
const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    // ユーザーが存在するか確認
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ユニークな口座番号を生成して作成
    // (実運用では重複チェックループが必要ですが、今回は簡易版)
    const newAccount = await Account.create({
      userId,
      accountNumber: generateAccountNumber(),
      balance: 100000 // 最初から10万円入っていることにします（テスト用）
    });

    return res.status(201).json({
      message: 'Account created successfully',
      account: newAccount
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 機能1: 特定の口座情報を取得（残高確認用）
export const getAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // URLパラメータからIDを取得

    const account = await Account.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }] // 所有者情報も一緒に取得
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    return res.json(account);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 機能2: 特定の口座の取引履歴を取得
export const getAccountTransactions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // まず口座があるかチェック
    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // 取引履歴を検索
    // 条件: (fromAccountId = ID) OR (toAccountId = ID)
    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { fromAccountId: id },
          { toAccountId: id }
        ]
      },
      order: [['createdAt', 'DESC']] // 新しい順に並び替え
    });

    return res.json(transactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};