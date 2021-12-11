export interface IQrCodeGenerator {
  generateQrCode(code: string): Promise<string>;
}
