import { Request, Response } from 'express';
import crypto from 'crypto';
import util from 'util';
import qrcode from 'qrcode';
import base32Encode from 'base32-encode';
import db from '../models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IRequest } from '../middleware';

const User = db.user;
const secretKey = process.env.AUTH_SECRET || 'secretKey';

export const signup = async (req: Request, res: Response): Promise<void> => {
  if (!req.body.email && !req.body.password) {
    res.status(401).json({
      resource: 'signup',
      code: 'invalid_parameter',
      message: '登録に失敗しました',
      errors: [
        {
          field: 'email',
          code: 'missing_field',
          message: 'メールアドレスが入力されていません。',
        },
        {
          field: 'password',
          code: 'missing_field',
          message: 'パスワードが入力されていません。',
        },
      ],
    });
    return;
  } else if (!req.body.email) {
    res.status(401).json({
      resource: 'signup',
      code: 'invalid_parameter',
      message: '登録に失敗しました',
      errors: [
        {
          field: 'email',
          code: 'missing_field',
          message: 'メールアドレスが入力されていません。',
        },
      ],
    });
    return;
  } else if (!req.body.password) {
    res.status(401).json({
      resource: 'signup',
      code: 'invalid_parameter',
      message: '登録に失敗しました',
      errors: [
        {
          field: 'email',
          code: 'missing_field',
          message: 'パスワードが入力されていません。',
        },
      ],
    });
    return;
  }

  try {
    const user = await User.create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      mfaEnabled: false,
      mfaSecretKey: '',
    });

    const token = jwt.sign(
      {
        id: user.id,
        mfaVerified: false,
      },
      secretKey,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    res.status(200).json({
      email: user.email,
      mfaEnabled: user.mfaEnabled,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      resource: 'signup',
      code: 'unexpected_error',
      message: '想定外のエラーが発生しました',
    });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  if (!req.body.email && !req.body.password) {
    res.status(401).json({
      resource: 'signin',
      code: 'invalid_parameter',
      message: 'ログインに失敗しました',
      errors: [
        {
          field: 'email',
          code: 'missing_field',
          message: 'メールアドレスが入力されていません。',
        },
        {
          field: 'password',
          code: 'missing_field',
          message: 'パスワードが入力されていません。',
        },
      ],
    });
    return;
  } else if (!req.body.email) {
    res.status(401).json({
      resource: 'signin',
      code: 'invalid_parameter',
      message: 'ログインに失敗しました',
      errors: [
        {
          field: 'email',
          code: 'missing_field',
          message: 'メールアドレスが入力されていません。',
        },
      ],
    });
    return;
  } else if (!req.body.password) {
    res.status(401).json({
      resource: 'signin',
      message: 'ログインに失敗しました',
      code: 'invalid_parameter',
      errors: [
        {
          field: 'email',
          code: 'missing_field',
          message: 'パスワードが入力されていません。',
        },
      ],
    });
    return;
  }

  try {
    const user = await User.findOne({
      email: req.body.email,
    }).select('+password');

    if (!user) {
      res.status(404).json({
        resource: 'signin',
        code: 'user_not_found',
        message: 'ログインに失敗しました',
        errors: [
          {
            field: 'email',
            code: 'not_found',
            message: '登録されていないメールアドレスです。',
          },
        ],
      });
      return;
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      res.status(401).json({
        resource: 'signin',
        code: 'invalid_password',
        message: 'ログインに失敗しました',
        errors: [
          {
            field: 'password',
            code: 'invalid',
            message: 'パスワードが間違えています。',
          },
        ],
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user._id,
        mfaVerified: false,
      },
      secretKey,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    res.status(200).json({
      email: user.email,
      mfaEnabled: user.mfaEnabled,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      resource: 'signin',
      code: 'unexpected_error',
      message: '想定外のエラーが発生しました。',
    });
  }
};

export const verifyOneTimePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const customReq = req as IRequest;
  const userId = customReq.userId;

  try {
    const token = jwt.sign(
      {
        id: userId,
        mfaVerified: true,
      },
      secretKey,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    res.status(200).send(token);
  } catch (err) {
    res.status(500).json({
      resource: 'verify_one_time_password',
      code: 'unexpected_error',
      message: '想定外のエラーが発生しました。',
    });
  }
};

export const enableMfa = async (req: Request, res: Response): Promise<void> => {
  const customReq = req as IRequest;
  const userId = customReq.userId;

  try {
    const { mfaSecretKey } = await User.findById(userId);

    if (!mfaSecretKey) {
      res.status(403).json({
        resource: 'verify_one_time_password',
        code: 'invalid_mfa',
        message: 'QRコードの登録が行われていません。',
      });
      return;
    }

    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { mfaEnabled: true } },
      { useFindAndModify: false }
    );
    const token = jwt.sign(
      {
        id: userId,
        mfaVerified: true,
      },
      secretKey,
      {
        expiresIn: 86400, // 24 hours
      }
    );
    res.status(200).send(token);
  } catch (err) {
    res.status(500).json({
      resource: 'verify_one_time_password',
      code: 'unexpected_error',
      message: '想定外のエラーが発生しました。',
    });
  }
};

export const generateMfaQRCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  const customReq = req as IRequest;
  const userId = customReq.userId;
  try {
    let { mfaSecretKey } = await User.findById(userId);

    if (!mfaSecretKey) {
      const buffer = await util.promisify(crypto.randomBytes)(14);
      mfaSecretKey = base32Encode(buffer, 'RFC4648', { padding: false });

      try {
        await User.findOneAndUpdate(
          { _id: userId },
          { $set: { mfaSecretKey: mfaSecretKey } },
          { useFindAndModify: false }
        );
      } catch (err) {
        res.status(500).json({
          resource: 'generate_mfa_qr_code',
          code: 'unexpected_error',
          message: '想定外のエラーが発生しました。',
        });
      }
    }

    const issuer = 'MfaDemo';
    const algorithm = 'SHA1';
    const digits = '6';
    const period = '30';
    const otpType = 'totp';
    const configUri =
      `otpauth://${otpType}/${issuer}:${userId}` +
      `?algorithm=${algorithm}&digits=${digits}` +
      `&period=${period}&issuer=${issuer}&secret=${mfaSecretKey}`;

    await qrcode.toFileStream(res, configUri);
  } catch (err) {
    res.status(500).json({
      resource: 'generate_mfa_qr_code',
      code: 'unexpected_error',
      message: '想定外のエラーが発生しました。',
    });
  }
};

export const generateMfaSettingCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  const customReq = req as IRequest;
  const userId = customReq.userId;
  try {
    let { mfaSecretKey } = await User.findById(userId);

    if (!mfaSecretKey) {
      const buffer = await util.promisify(crypto.randomBytes)(14);
      mfaSecretKey = base32Encode(buffer, 'RFC4648', { padding: false });

      try {
        await User.findOneAndUpdate(
          { _id: userId },
          { $set: { mfaSecretKey: mfaSecretKey } },
          { useFindAndModify: false }
        );
      } catch (err) {
        res.status(500).json({
          resource: 'generate_mfa_qr_code',
          code: 'unexpected_error',
          message: '想定外のエラーが発生しました。',
        });
      }
    }

    res.status(200).json(mfaSecretKey);
  } catch (err) {
    res.status(500).json({
      resource: 'generate_mfa_qr_code',
      code: 'unexpected_error',
      message: '想定外のエラーが発生しました。',
    });
  }
};
