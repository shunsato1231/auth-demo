import { Controllers, Gateways, Presenters } from '@adapters';
import { MongoTransactionalDataMappers } from '@infrastructure/db';
import { JsonWebToken } from '@infrastructure/pulgins/JsonWebToken';
import TOTPGenerator from '@infrastructure/pulgins/TOTPGenerator';
import { VerifyMfa } from '@useCases';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
const secretKey = process.env.AUTH_SECRET || 'secretKey';

export default async (req: Request, res: Response): Promise<void> => {
  const getVerifyMfaGateway = new Gateways.VerifyMfaGateway(
    new TOTPGenerator(),
    new MongoTransactionalDataMappers(mongoose),
    new JsonWebToken(),
    secretKey
  );
  const getVerifyMfaPresenter = new Presenters.VerifyMfaPresenter();
  const getVerifyMfaInteractor = new VerifyMfa.VerifyMfaInteractor(
    getVerifyMfaGateway,
    getVerifyMfaPresenter
  );

  const verifyMfaController = new Controllers.VerifyMfaController(
    req,
    getVerifyMfaInteractor
  );

  await verifyMfaController.run();

  const view = getVerifyMfaPresenter.view;
  res.status(view.statusCode).json(view.body);
};
