import { Token } from '../../adapters/gateways/Token';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

  createCsrf(): string {
    return Math.random().toString(36).slice(-8);
  }

  public toEncrypt(value: string): Promise<string> {
    return bcrypt.hash(value, 8);
  }

  public compareEncrypted(
    original: string,
    encrypted: string
  ): Promise<boolean> {
    return bcrypt.compare(original, encrypted);
  }
}
