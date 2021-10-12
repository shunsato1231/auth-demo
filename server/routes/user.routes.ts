import { Express, Response, NextFunction } from 'express';
import { authJwt } from '../middleware';
import { allAccess, userBoard } from '../controllers/user.controller';

export default (app: Express): void => {
  app.use((_, res: Response, next: NextFunction) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get('/api/test/all', allAccess);

  app.get(
    '/api/test/user',
    [authJwt.verifyToken, authJwt.isMfaVerified],
    userBoard
  );
};
