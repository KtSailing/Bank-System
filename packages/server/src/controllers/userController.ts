// packages/server/src/controllers/userController.ts
import { Request, Response } from 'express';
import { User } from '../models/User';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // バリデーション（簡易）
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // ユーザー作成
    // ※本来はここでパスワードをハッシュ化(bcrypt等)すべきですが、今回は平文で進めます
    const newUser = await User.create({
      name,
      email,
      passwordHash: password 
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};