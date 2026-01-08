// packages/server/src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Account } from '../models/Account';

// 秘密鍵（本番では.envファイルで管理すべきですが、今回は定数で置きます）
const JWT_SECRET = 'super-secret-key-12345';

// 1. 本格的なユーザー登録（ハッシュ化あり）
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // パスワードのハッシュ化 (コスト10)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      passwordHash: hashedPassword // ハッシュ化したものを保存
    });

    // 自動で口座も作ってあげる（UX向上のため）
    await Account.create({
      userId: newUser.id,
      accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      balance: 0 
    });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

// 2. ログイン処理
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ユーザーを探す
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // パスワード照合
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // JWTトークン発行（有効期限1時間）
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // クライアントにはトークンとユーザー基本情報を返す
    return res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Login failed' });
  }
};