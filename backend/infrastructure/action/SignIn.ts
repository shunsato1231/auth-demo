import { Controllers, Gateways, Presenters } from '@adapters';
import { MongoTransactionalDataMappers } from '@infrastructure/db';
import { JsonWebToken } from '@infrastructure/pulgins/JsonWebToken';
import { SignIn } from '@useCases';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
const secretKey = process.env.AUTH_SECRET || 'secretKey';

export default async (req: Request, res: Response): Promise<void> => {
  const getSignInGateway = new Gateways.SignInGateway(
    new MongoTransactionalDataMappers(mongoose),
    new JsonWebToken(),
    secretKey
  );
  const getSignInPresenter = new Presenters.SignInPresenter();
  const getSignInInteractor = new SignIn.SignInInteractor(
    getSignInGateway,
    getSignInPresenter
  );

  const signInController = new Controllers.SignInController(
    req,
    getSignInInteractor
  );

  await signInController.run();
  const view = getSignInPresenter.view;

  res.status(view.statusCode).json(view.body);
};
