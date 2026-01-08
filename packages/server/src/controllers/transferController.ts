// packages/server/src/controllers/transferController.ts
import { Request, Response } from 'express';
import { sequelize, Account, Transaction } from '../models';

export const transferMoney = async (req: Request, res: Response) => {
  // トランザクションを開始
  const t = await sequelize.transaction();

  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    // 数値のチェック
    if (!amount || amount <= 0) {
      throw new Error('送金額は1以上である必要があります');
    }

    // 1. 送金元の口座を取得（ロックをかけるのが理想ですが今回は省略）
    const sender = await Account.findByPk(fromAccountId, { transaction: t });
    // 2. 送金先の口座を取得
    const receiver = await Account.findByPk(toAccountId, { transaction: t });

    // バリデーション
    if (!sender) throw new Error('送金元口座が見つかりません');
    if (!receiver) throw new Error('送金先口座が見つかりません');
    if (sender.balance < amount) throw new Error('残高不足です');
    if (sender.id === receiver.id) throw new Error('自分自身には送金できません');

    // 3. 送金元の残高を減らす
    await sender.update({ balance: sender.balance - amount }, { transaction: t });

    // 4. 送金先の残高を増やす
    await receiver.update({ balance: receiver.balance + amount }, { transaction: t });

    // 5. 取引履歴を記録する
    const transactionRecord = await Transaction.create({
      fromAccountId,
      toAccountId,
      amount,
      type: 'TRANSFER'
    }, { transaction: t });

    // ここまでエラーがなければコミット（確定）される
    await t.commit();

    return res.status(200).json({
      message: 'Transfer successful',
      transaction: transactionRecord,
      senderBalance: sender.balance // 更新後の残高
    });

  } catch (error: any) {
    // エラーが起きたらロールバック（取り消し）
    await t.rollback();
    console.error('Transfer failed:', error.message);
    
    return res.status(400).json({
      error: 'Transfer failed',
      details: error.message
    });
  }
};