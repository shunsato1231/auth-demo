export interface ITOTPGenerator {
  generateKey(): Promise<string>;
  generateTOTP(secret: string, window: number): string;
}
