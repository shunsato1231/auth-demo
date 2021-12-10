import { Controllers, Gateways, Presenters } from '@adapters';
import { MongoTransactionalDataMappers } from '@infrastructure/db';
import { JsonWebToken } from '@infrastructure/pulgins/JsonWebToken';
import TOTPGenerator from '@infrastructure/pulgins/TOTPGenerator';
import { EnableMfa } from '@useCases';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
const secretKey = process.env.AUTH_SECRET || 'secretKey';

export default async (req: Request, res: Response): Promise<void> => {
  const getEnableMfaGateway = new Gateways.EnableMfaGateway(
    new TOTPGenerator(),
    new MongoTransactionalDataMappers(mongoose),
    new JsonWebToken(),
    secretKey
  );
  const getEnableMfaPresenter = new Presenters.EnableMfaPresenter();
  const getEnableMfaInteractor = new EnableMfa.EnableMfaInteractor(
    getEnableMfaGateway,
    getEnableMfaPresenter
  );

  const enableMfaController = new Controllers.EnableMfaController(
    req,
    getEnableMfaInteractor
  );

  await enableMfaController.run();
  const view = getEnableMfaPresenter.view;

  res.status(view.statusCode).json(view.body);
};
