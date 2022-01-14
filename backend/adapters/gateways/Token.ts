export interface Token {
  signJwt(payload: unknown, secretKey: string, expiresIn: string): string;
  verifyJwt<T>(token: string, secretKey: string): Promise<T>;
}
