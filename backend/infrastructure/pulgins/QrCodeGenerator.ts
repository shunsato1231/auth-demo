import { IQrCodeGenerator } from '../../adapters/gateways/QrCodeGenerator';
import qrcode from 'qrcode';

export class QrCodeGenerator implements IQrCodeGenerator {
  public generateQrCode(code: string): Promise<string> {
    return qrcode.toDataURL(code, {
      width: 600,
      margin: 0,
    });
  }
}
