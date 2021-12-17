export interface Token {
  sign(payload: unknown, secretKey: string, expiresIn: number): string;
  verify(token: string, secretKey: string): unknown;
  signJwt(
    payload: { [key: string]: unknown },
    secretKey: string,
    expiresIn: string
  ): string;
  verifyJwt<T>(token: string, secretKey: string): Promise<T>;
  createCsrf(): string;
  toEncrypt(value: string): Promise<string>;
  compareEncrypted(original: string, encrypted: string): Promise<boolean>;
}
