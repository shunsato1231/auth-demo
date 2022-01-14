import { Token } from '../../adapters/gateways/Token';
import jwt from 'jsonwebtoken';

export class JsonWebToken implements Token {
  public sign(payload: unknown, secretKey: string, expiresIn: number): string {
    return jwt.sign(payload as { [key: string]: unknown }, secretKey, {
      expiresIn,
    });
  }

  public verify(token: string, secretKey: string): unknown {
    return jwt.verify(token, secretKey);
  }

  public signJwt(
    payload: unknown,
    secretKey: string,
    expiresIn: string
  ): string {
    return jwt.sign(payload as { [key: string]: unknown }, secretKey, {
      expiresIn,
    });
  }

  public verifyJwt<T>(token: string, secretKey: string): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, payload) => {
        if (err) {
          reject(err);
        } else {
          resolve(payload as T);
        }
      });
    });
  }
}
