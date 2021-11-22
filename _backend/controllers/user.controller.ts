import { Request, Response } from 'express';
import db from '../models';

const User = db.user;

export interface IRequest extends Request {
  userId: string;
}

export const allAccess = (_: Request, res: Response): void => {
  res.status(200).send('Public Content.');
};

export const userBoard = async (req: Request, res: Response): Promise<void> => {
  const customReq = req as IRequest;
  const { userId } = customReq;
  try {
    const { email } = await User.findById(userId).select('+email');

    res.status(200).send(`User Content. You are '${email}'`);
  } catch (err) {
    res.status(403).json({
      message: err,
      success: false,
    });
  }
};
