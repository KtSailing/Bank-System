// packages/server/src/models/Transaction.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

export class Transaction extends Model {
  public id!: number;
  public fromAccountId!: number | null; // 入金の場合はnullになることもあるため
  public toAccountId!: number | null;   // 出金の場合はnullになることもあるため
  public amount!: number;
  public type!: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'; // 取引種別

  public readonly createdAt!: Date;
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
    },
    {
      sequelize,
      tableName: 'transactions',
      updatedAt: false, // 履歴は更新されないので不要
    }
  );
};