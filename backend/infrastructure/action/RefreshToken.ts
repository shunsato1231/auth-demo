import { Controllers, Gateways, Presenters } from '@adapters';
import { MongoTransactionalDataMappers } from '@infrastructure/db';
import { JsonWebToken } from '@infrastructure/pulgins/JsonWebToken';
import { RefreshToken } from '@useCases';
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

  const view = getRefreshTokenPresenter.view;
  res.status(view.statusCode).json(view.body);
};
