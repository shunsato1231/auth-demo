import { ITOTPGenerator } from 'backend/adapters/gateways/TOTPGenerator';
import util from 'util';
import crypto from 'crypto';
import base32Encode from 'base32-encode';
import base32Decode from 'base32-decode';

export default class TOTPGenerator implements ITOTPGenerator {
  public async generateKey(): Promise<string> {
    const buffer = await util.promisify(crypto.randomBytes)(14);
    return base32Encode(buffer, 'RFC4648', { padding: false });
  }
  public generateTOTP(secret: string, window: number): string {
    const counter = Math.floor(Date.now() / 30000);
    return TOTPGenerator.generateHOTP(secret, counter + window);
  }
  private static generateHOTP(secret: string, counter: number): string {
    const decodedSecret = base32Decode(secret, 'RFC4648');

    const buffer = Buffer.alloc(8);
    for (let i = 0; i < 8; i++) {
      buffer[7 - i] = counter & 0xff;
      counter = counter >> 8;
    }

    // Step 1: Generate an HMAC-SHA-1 value
    const hmac = crypto.createHmac('sha1', Buffer.from(decodedSecret));
    hmac.update(buffer);
    const hmacResult = hmac.digest();

    // Step 2: Generate a 4-byte string (Dynamic Truncation)
    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const code =
      ((hmacResult[offset] & 0x7f) << 24) |
      ((hmacResult[offset + 1] & 0xff) << 16) |
      ((hmacResult[offset + 2] & 0xff) << 8) |
      (hmacResult[offset + 3] & 0xff);

    // Step 3: Compute an HOTP value
    return `${code % 10 ** 6}`.padStart(6, '0');
  }
}
