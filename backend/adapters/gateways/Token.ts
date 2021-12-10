export interface Token {
  sign(payload: unknown, secretKey: string, expiresIn: number): string;
  verify(token: string, secretKey: string): unknown;
}
