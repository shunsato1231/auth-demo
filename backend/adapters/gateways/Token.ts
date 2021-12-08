export interface Token {
  sign(payload: unknown, secretKey: string, expiresIn: string): string;
  verify(token: string, secretKey: string): unknown;
}
