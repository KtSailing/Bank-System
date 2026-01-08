// packages/server/src/models/Account.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

export class Account extends Model {
  public id!: number;
  public userId!: number; // 外部キー
  public accountNumber!: string;
  public balance!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initAccount = (sequelize: Sequelize) => {
  Account.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 初期残高は0
      },
    },
    {
      sequelize,
      tableName: 'accounts',
    }
  );
};