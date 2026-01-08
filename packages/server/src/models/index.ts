import { Sequelize } from 'sequelize';
import { User, initUser } from './User';
import { Account, initAccount } from './Account';
import { Transaction, initTransaction } from './Transaction';

// DB接続設定
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './bank.sqlite',
  logging: console.log, // 実行されたSQLログを確認できるようにします
});

// モデルの初期化
initUser(sequelize);
initAccount(sequelize);
initTransaction(sequelize);

// リレーション（関係性）の定義

// 1. ユーザーは複数の口座を持てる (User -> Account)
User.hasMany(Account, { foreignKey: 'userId', as: 'accounts' });
Account.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 2. 口座は複数の取引履歴を持つ (Account -> Transaction)
// 送金元としての履歴
Account.hasMany(Transaction, { foreignKey: 'fromAccountId', as: 'sentTransactions' });
// 受取先としての履歴
Account.hasMany(Transaction, { foreignKey: 'toAccountId', as: 'receivedTransactions' });

export { sequelize, User, Account, Transaction };