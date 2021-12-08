import { HashedValueGenerator } from '@entities';
import bcrypt from 'bcryptjs';

export default class BcryptHash implements HashedValueGenerator {
  public toHash(value: string): string {
    const res = bcrypt.hashSync(value, 8);
    console.log(res);
    return res;
  }

  public compareValue(value: string, hashedValue: string): boolean {
    console.log(value);
    console.log(hashedValue);
    console.log(bcrypt.compareSync(value, hashedValue));
    return bcrypt.compareSync(value, hashedValue);
  }
}
