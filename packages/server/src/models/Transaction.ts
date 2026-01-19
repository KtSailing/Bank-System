// packages/server/src/models/Transaction.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

export class Transaction extends Model {
  public id!: number;
  public fromAccountId!: number | null;
  public toAccountId!: number | null;
  public amount!: number;
  public type!: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  
  // 追加フィールド
  public description!: string; 

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date; // trueにするため型定義を追加
}

export const initTransaction = (sequelize: Sequelize) => {
  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fromAccountId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      toAccountId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 追加: 説明文
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '', // デフォルトは空文字
      },
    },
    {
      sequelize,
      tableName: 'transactions',
      updatedAt: true, // trueに変更（または行削除）して更新日時を有効化
    }
  );
};