// packages/server/src/controllers/transferController.ts
import { Request, Response } from 'express';
import { sequelize, Account, Transaction } from '../models';

export const transferMoney = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();

  try {
    // toAccountId ではなく toAccountNumber (相手の口座番号) を受け取る
    const { fromAccountId, toAccountNumber, amount } = req.body;

    if (!amount || amount <= 0) throw new Error('送金額は1以上である必要があります');

    // 1. 送金元（自分）の口座取得
    const sender = await Account.findByPk(fromAccountId, { transaction: t });
    if (!sender) throw new Error('送金元口座が見つかりません');

    // 2. 送金先（相手）の口座を「口座番号」で検索
    const receiver = await Account.findOne({ 
      where: { accountNumber: toAccountNumber },
      transaction: t 
    });
    if (!receiver) throw new Error('指定された送金先口座番号が見つかりません');

    // チェック
    if (sender.balance < amount) throw new Error('残高不足です');
    if (sender.id === receiver.id) throw new Error('自分自身の口座には送金できません');

    // 3. 残高更新
    await sender.update({ balance: sender.balance - amount }, { transaction: t });
    await receiver.update({ balance: receiver.balance + amount }, { transaction: t });

    // 4. 履歴作成
    const transactionRecord = await Transaction.create({
      fromAccountId: sender.id,
      toAccountId: receiver.id,
      amount,
      type: 'TRANSFER'
    }, { transaction: t });

    await t.commit();

    return res.status(200).json({
      message: 'Transfer successful',
      transaction: transactionRecord,
      senderBalance: sender.balance
    });

  } catch (error: any) {
    await t.rollback();
    return res.status(400).json({ error: error.message });
  }
};