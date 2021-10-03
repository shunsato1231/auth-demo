import Express from 'express';
import { db } from '../models';

const User = db.user;

const checkDuplicateUsernameOrEmail = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
): void => {
  User.findOne({
    email: req.body.email,
  }).exec((err, email) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (email) {
      res.status(400).send({ message: 'Failed! Email is already in use!' });
      return;
    }

    next();
  });
};

export const verifySignUp = {
  checkDuplicateUsernameOrEmail,
};
