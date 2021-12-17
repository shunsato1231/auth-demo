import {
  CSRF_ACCESS_TOKEN_NAME,
  CSRF_REFRESH_TOKEN_NAME,
  JWT_ACCESS_TOKEN_NAME,
  JWT_REFRESH_TOKEN_NAME,
} from '@utils';
import { Request, Response } from 'express';

export default async (_: Request, res: Response): Promise<void> => {
  res.clearCookie(JWT_ACCESS_TOKEN_NAME);
  res.clearCookie(CSRF_ACCESS_TOKEN_NAME);
  res.clearCookie(JWT_REFRESH_TOKEN_NAME);
  res.clearCookie(CSRF_REFRESH_TOKEN_NAME);
  res.sendStatus(200);
};
