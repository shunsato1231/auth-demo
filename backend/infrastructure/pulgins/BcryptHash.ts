import { HashedValueGenerator } from '@entities';
import bcrypt from 'bcryptjs';

export default class BcryptHash implements HashedValueGenerator {
  public toHash(value: string): string {
    const res = bcrypt.hashSync(value, 8);
    return res;
  }

  public compareValue(value: string, hashedValue: string): boolean {
    return bcrypt.compareSync(value, hashedValue);
  }
}
