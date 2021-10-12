import { Request, Response, NextFunction } from 'express';
import db from '../models';

const User = db.user;

const checkDuplicateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      res.status(409).json({
        code: 'emailAlreadyUse',
        message: 'Email is already in use.',
        error_user_title: '登録エラー',
        error_user_message: 'このメールアドレスは既に登録されています。',
      });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({
      code: 'unexpectedError',
      message: 'Unexpected error.',
      error_user_title: 'エラー',
      error_user_message: '想定外のエラーが発生しました。',
    });
  }
};

export const verifySignUp = {
  checkDuplicateEmail,
};
