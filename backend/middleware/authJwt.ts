import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import db from '../models';

import crypto from 'crypto';
import base32Decode from 'base32-decode';

const User = db.user;
const secretKey = process.env.AUTH_SECRET || 'secretKey';

export interface IRequest extends Request {
  userId: string;
  mfaVerified: boolean;
}

const decodeJWT = <T extends { [key: string]: unknown }>(
  token: string,
  secretKey: string
) => {
  return verify(token, secretKey) as JwtPayload & T;
};

const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  console.log(token);

  if (token) {
    try {
      const payload = decodeJWT<{ id?: string }>(token, secretKey);
      const { id, mfaVerified } = payload;

      if (id) {
        const user = await User.findById(id).catch(() => {
          res.status(401).json({
            code: 'invalidToken',
            message: 'Invalid token.',
            error_user_title: '認証エラー',
            error_user_message:
              'トークンが正しくありません。ログインし直してください。',
          });
          return;
        });

        if (user) {
          const customReq = req as IRequest;
          customReq.userId = id;
          customReq.mfaVerified = mfaVerified;
          next();
        } else {
          res.status(401).json({
            code: 'invalidToken',
            message: 'Invalid token.',
            error_user_title: '認証エラー',
            error_user_message:
              'トークンが正しくありません。ログインし直してください。',
          });
          return;
        }
      } else {
        res.status(401).json({
          code: 'invalidToken',
          message: 'Invalid token.',
          error_user_title: '認証エラー',
          error_user_message:
            'トークンが正しくありません。ログインし直してください。',
        });
        return;
      }
    } catch (err) {
      res.status(500).json({
        code: 'unexpectedError',
        message: 'Unexpected error.',
        error_user_title: 'エラー',
        error_user_message: '想定外のエラーが発生しました。',
      });
      return;
    }
  } else {
    res.status(401).json({
      code: 'invalidToken',
      message: 'Invalid token.',
      error_user_title: '認証エラー',
      error_user_message:
        'トークンが正しくありません。ログインし直してください。',
    });
  }
};

const generateHOTP = (secret: string, counter: number) => {
  const decodedSecret = base32Decode(secret, 'RFC4648');

  const buffer = Buffer.alloc(8);
  for (let i = 0; i < 8; i++) {
    buffer[7 - i] = counter & 0xff;
    counter = counter >> 8;
  }

  // Step 1: Generate an HMAC-SHA-1 value
  const hmac = crypto.createHmac('sha1', Buffer.from(decodedSecret));
  hmac.update(buffer);
  const hmacResult = hmac.digest();

  // Step 2: Generate a 4-byte string (Dynamic Truncation)
  const offset = hmacResult[hmacResult.length - 1] & 0xf;
  const code =
    ((hmacResult[offset] & 0x7f) << 24) |
    ((hmacResult[offset + 1] & 0xff) << 16) |
    ((hmacResult[offset + 2] & 0xff) << 8) |
    (hmacResult[offset + 3] & 0xff);

  // Step 3: Compute an HOTP value
  return `${code % 10 ** 6}`.padStart(6, '0');
};

const generateTOTP = (secret: string, window = 0) => {
  const counter = Math.floor(Date.now() / 30000);
  return generateHOTP(secret, counter + window);
};

export const verifyTOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const customReq = req as IRequest;
  const userId = customReq.userId;
  const oneTimePassword = req.body.code;

  if (!oneTimePassword) {
    res.status(401).json({
      code: 'emptyOneTimePassword',
      message: 'Empty one time token.',
      error_user_title: '認証エラー',
      error_user_message: 'ワンタイムパスワードが入力されていません。',
    });
    return;
  }

  const { mfaSecretKey } = await User.findById(userId).catch(() => {
    res.status(400).json({
      code: 'invalidToken',
      message: 'Invalid token.',
      error_user_title: '認証エラー',
      error_user_message:
        'トークンが正しくありません。ログインし直してください。',
    });
    return;
  });

  if (!mfaSecretKey) {
    res.status(403).json({
      code: 'notSetMfaKey',
      message: 'Mfa secret key is undefined.',
      error_user_title: '認証エラー',
      error_user_message: '2段階認証が正しく設定されていません。',
    });
    return;
  }

  const window = 1;
  for (let errorWindow = -window; errorWindow <= +window; errorWindow++) {
    const totp = generateTOTP(mfaSecretKey, errorWindow);
    if (oneTimePassword === totp) {
      next();
      return;
    }
  }

  res.status(401).json({
    code: 'invalidOneTimePassword',
    message: 'Invalid one time password.',
    error_user_title: '認証エラー',
    error_user_message: 'ワンタイムパスワードが正しくありません。',
  });
};

const isDisabledMfa = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const customReq = req as IRequest;
  const userId = customReq.userId;

  try {
    const { mfaEnabled } = await User.findById(userId);

    if (mfaEnabled) {
      res.status(403).json({
        code: 'alreadyEnabledMfa',
        message: 'Mfa is enabled already.',
        error_user_title: 'エラー',
        error_user_message: '2段階認証は既に設定済みです。',
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

export const isMfaVerified = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const customReq = req as IRequest;
  const { userId, mfaVerified } = customReq;

  if (customReq) {
    try {
      const { mfaEnabled } = await User.findOne({ _id: userId });
      if (!mfaEnabled) {
        res.status(403).json({
          code: 'disabledMfa',
          message: 'Not enabled mfa',
          error_user_title: '認証エラー',
          error_user_message: '2段階認証が設定されていません。',
        });
        return;
      }

      if (mfaEnabled && !mfaVerified) {
        res.status(403).json({
          code: 'notAuthenticationMfa',
          message: 'Not authentication mfa',
          error_user_title: '認証エラー',
          error_user_message: '2段階認証が認証されていません。',
        });
        return;
      }

      next();
    } catch (err) {
      res.status(500).json({
        code: 'unexpectedError',
        message: 'Unexpected error.',
        error_user_title: 'エラー',
        error_user_message: '想定外のエラーが発生しました。',
      });
      return;
    }
  } else {
    res.status(403).json({
      code: 'emptyToken',
      message: 'Empty token.',
      error_user_title: '認証エラー',
      error_user_message: 'トークンがありません。ログインし直してください',
    });
    return;
  }
};

export const authJwt = {
  verifyToken,
  verifyTOTP,
  isDisabledMfa,
  isMfaVerified,
};
