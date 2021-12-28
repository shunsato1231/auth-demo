import { Controllers, Gateways, Presenters } from '@adapters';
import { MongoTransactionalDataMappers } from '@infrastructure/db';
import { JsonWebToken } from '@infrastructure/pulgins/JsonWebToken';
import { SignIn } from '@useCases';
import {
  CSRF_ACCESS_TOKEN_NAME,
  CSRF_REFRESH_TOKEN_NAME,
  JWT_ACCESS_TOKEN_NAME,
  JWT_REFRESH_TOKEN_NAME,
} from '@utils';
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

  const token = getSignInPresenter.token;
  if (token) {
    res.cookie(JWT_ACCESS_TOKEN_NAME, token.accessToken.jwt, {
      httpOnly: true,
      secure: true,
    });
    res.cookie(JWT_REFRESH_TOKEN_NAME, token.refreshToken.jwt, {
      httpOnly: true,
      secure: true,
    });
    res.cookie(CSRF_ACCESS_TOKEN_NAME, token.accessToken.csrf, {
      secure: true,
    });
    res.cookie(CSRF_REFRESH_TOKEN_NAME, token.refreshToken.csrf, {
      secure: true,
    });
  }

  const view = getSignInPresenter.view;
  res.status(view.statusCode).json(view.body);
};