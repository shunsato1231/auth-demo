import { HashedValueGenerator } from '@entities';
import bcrypt from 'bcryptjs';

export default class BcryptHash implements HashedValueGenerator {
  public toHash(value: string): string {
    return bcrypt.hashSync(value, 8);
  }

  public compareValue(value: string, hashedValue: string): boolean {
    return bcrypt.compareSync(value, hashedValue);
  }
}
