import { Controllers, Gateways, Presenters } from '@adapters';
import { SignUp } from '@useCases';
import { JsonWebToken } from '../pulgins/JsonWebToken';
import { MongoTransactionalDataMappers } from '../db';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

const secretKey = process.env.AUTH_SECRET || 'secretKey';

export default async (req: Request, res: Response): Promise<void> => {
  const getSignUpGateway = new Gateways.SignUpGateway(
    new MongoTransactionalDataMappers(mongoose),
    new JsonWebToken(),
    secretKey
  );
  const getSignUpPresenter = new Presenters.SignUpPresenter();
  const getSignUpInteractor = new SignUp.SignUpInteractor(
    getSignUpGateway,
    getSignUpPresenter
  );
  const signUpController = new Controllers.SignUpController(
    req,
    getSignUpInteractor
  );

  await signUpController.run();
  const view = getSignUpPresenter.view;

  res.status(view.statusCode).json(view.body);
};
