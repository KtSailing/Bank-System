// packages/server/src/controllers/adminController.ts
import { Request, Response } from 'express';
import { Transaction } from '../models';

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    // リレーションシップ（include）を使わず、生のデータをそのまま返す
    // これにより、クライアントは senderName などを知るために
    // 別途 API を叩かなければならなくなる。
    const transactions = await Transaction.findAll({
      order: [['updatedAt', 'DESC']],
    });

    return res.json(transactions);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};