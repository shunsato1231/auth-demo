import { Express, Response, NextFunction } from 'express';
import { verifySignUp, authJwt } from '../middleware';
import {
  signin,
  signup,
  verifyOneTimePassword,
  enableMfa,
  generateMfaQRCode,
} from '../controllers/auth.controller';

export default (app: Express): void => {
  app.use((_, res: Response, next: NextFunction) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post('/api/auth/signup', [verifySignUp.checkDuplicateEmail], signup);

  app.post('/api/auth/signin', signin);

  app.post(
    '/api/auth/verify_mfa',
    [authJwt.verifyToken, authJwt.verifyTOTP],
    verifyOneTimePassword
  );

  app.post(
    '/api/auth/enabled_mfa',
    [authJwt.verifyToken, authJwt.isDisabledMfa, authJwt.verifyTOTP],
    enableMfa
  );

  app.get(
    '/api/auth/mfa_qr_code',
    [authJwt.verifyToken, authJwt.isDisabledMfa],
    generateMfaQRCode
  );
};
