import { Controllers, Gateways, Presenters } from '@adapters';
import { MongoTransactionalDataMappers } from '@infrastructure/db';
import { JsonWebToken } from '@infrastructure/pulgins/JsonWebToken';
import TOTPGenerator from '@infrastructure/pulgins/TOTPGenerator';
import { GetMfaSettingCode } from '@useCases';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
const secretKey = process.env.AUTH_SECRET || 'secretKey';

export default async (req: Request, res: Response): Promise<void> => {
  const getGetMfaSettingCodeGateway = new Gateways.GetMfaSettingCodeGateway(
    new TOTPGenerator(),
    new MongoTransactionalDataMappers(mongoose),
    new JsonWebToken(),
    secretKey
  );
  const getGetMfaSettingCodePresenter =
    new Presenters.GetMfaSettingCodePresenter();
  const getGetMfaSettingCodeInteractor =
    new GetMfaSettingCode.GetMfaSettingCodeInteractor(
      getGetMfaSettingCodeGateway,
      getGetMfaSettingCodePresenter
    );

  const getMfaSettingCodeController =
    new Controllers.GetMfaSettingCodeController(
      req,
      getGetMfaSettingCodeInteractor
    );

  await getMfaSettingCodeController.run();
  const view = getGetMfaSettingCodePresenter.view;

  res.status(view.statusCode).json(view.body);
};
