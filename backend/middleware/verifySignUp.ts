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
        errors: [
          {
            resource: 'check_duplicate_email',
            field: 'email',
            code: 'duplicate_email',
            message: 'このメールアドレスは既に使用されています。',
          },
        ],
      });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({
      errors: [
        {
          resource: 'check_duplicate_email',
          field: '',
          code: 'unexpected_error',
          message: '想定外のエラーが発生しました。',
        },
      ],
    });
  }
};

export const verifySignUp = {
  checkDuplicateEmail,
};
