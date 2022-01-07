import { HashedValueGenerator } from '@entities';
import bcrypt from 'bcryptjs';

export default class BcryptHash implements HashedValueGenerator {
  public toHash(value: string): Promise<string> {
    const res = bcrypt.hash(value, 8);
    return res;
  }

  public compareValue(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
