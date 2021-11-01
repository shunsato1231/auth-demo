import { Express, Response, NextFunction } from 'express';
import { verifySignUp, authJwt } from '../middleware';
import {
  signin,
  signup,
  verifyOneTimePassword,
  enableMfa,
  generateMfaQRCode,
  generateMfaSettingCode,
} from '../controllers/auth.controller';

export default (app: Express): void => {
  app.use((_, res: Response, next: NextFunction) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post('/auth/signup', [verifySignUp.checkDuplicateEmail], signup);

  app.post('/auth/signin', signin);

  app.post(
    '/auth/verify_mfa',
    [authJwt.verifyToken, authJwt.verifyTOTP],
    verifyOneTimePassword
  );

  app.post(
    '/auth/enabled_mfa',
    [authJwt.verifyToken, authJwt.isDisabledMfa, authJwt.verifyTOTP],
    enableMfa
  );

  app.get(
    '/auth/mfa_qr_code',
    [authJwt.verifyToken, authJwt.isDisabledMfa],
    generateMfaQRCode
  );

  app.get(
    '/auth/mfa_setting_code',
    [authJwt.verifyToken, authJwt.isDisabledMfa],
    generateMfaSettingCode
  );
};
