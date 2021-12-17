import { Controllers, Gateways, Presenters } from '@adapters';
import { MongoTransactionalDataMappers } from '@infrastructure/db';
import { JsonWebToken } from '@infrastructure/pulgins/JsonWebToken';
import { RefreshToken } from '@useCases';
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
  const getRefreshTokenGateway = new Gateways.RefreshTokenGateway(
    new MongoTransactionalDataMappers(mongoose),
    new JsonWebToken(),
    secretKey
  );
  const getRefreshTokenPresenter = new Presenters.RefreshTokenPresenter();
  const getRefreshTokenInteractor = new RefreshToken.RefreshTokenInteractor(
    getRefreshTokenGateway,
    getRefreshTokenPresenter
  );

  const refreshTokenController = new Controllers.RefreshTokenController(
    req,
    getRefreshTokenInteractor
  );

  await refreshTokenController.run();

  const token = getRefreshTokenPresenter.token;
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

  const view = getRefreshTokenPresenter.view;
  res.status(view.statusCode).json(view.body);
};
