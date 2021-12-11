import { Controllers, Gateways, Presenters } from '@adapters';
import { MongoTransactionalDataMappers } from '@infrastructure/db';
import { JsonWebToken } from '@infrastructure/pulgins/JsonWebToken';
import { QrCodeGenerator } from '@infrastructure/pulgins/QrCodeGenerator';
import TOTPGenerator from '@infrastructure/pulgins/TOTPGenerator';
import { GetMfaQrCode } from '@useCases';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
const secretKey = process.env.AUTH_SECRET || 'secretKey';

export default async (req: Request, res: Response): Promise<void> => {
  const getGetMfaQrCodeGateway = new Gateways.GetMfaQrCodeGateway(
    new TOTPGenerator(),
    new QrCodeGenerator(),
    new MongoTransactionalDataMappers(mongoose),
    new JsonWebToken(),
    secretKey
  );
  const getGetMfaQrCodePresenter = new Presenters.GetMfaQrCodePresenter();
  const getGetMfaQrCodeInteractor = new GetMfaQrCode.GetMfaQrCodeInteractor(
    getGetMfaQrCodeGateway,
    getGetMfaQrCodePresenter
  );

  const getMfaQrCodeController = new Controllers.GetMfaQrCodeController(
    req,
    getGetMfaQrCodeInteractor
  );

  await getMfaQrCodeController.run();
  const view = getGetMfaQrCodePresenter.view;

  res.status(view.statusCode).json(view.body);
};
