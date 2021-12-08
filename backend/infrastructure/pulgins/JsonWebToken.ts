import { Token } from '../../adapters/gateways/Token';
import jwt from 'jsonwebtoken';

export class JsonWebToken implements Token {
  public sign(payload: unknown, secretKey: string, expiresIn: string): string {
    return jwt.sign(payload as { [key: string]: unknown }, secretKey, {
      expiresIn,
    });
  }

  public verify(token: string, secretKey: string): unknown {
    return jwt.verify(token, secretKey);
  }
}
