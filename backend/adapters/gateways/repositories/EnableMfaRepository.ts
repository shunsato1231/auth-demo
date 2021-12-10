import { UniqueEntityID, User } from '@entities';
import { EnableMfa } from '@useCases';
import { TransactionalDataMappers } from '..';
import { ITOTPGenerator } from '../TOTPGenerator';
import { Token } from '../Token';
import { BaseRepository } from './BaseRepository';

export class EnableMfaRepository
  extends BaseRepository
  implements EnableMfa.EnableMfaGateway
{
  private _totpGenerator: ITOTPGenerator;
  constructor(
    totpGenerator: ITOTPGenerator,
    mappers: TransactionalDataMappers,
    token: Token,
    tokenSecretKey: string
  ) {
    super(mappers, token, tokenSecretKey);
    this._totpGenerator = totpGenerator;
  }
  public async findUserById(id: UniqueEntityID): Promise<User | undefined> {
    const user = await this.abstractFindById('User', id);

    if (!user) {
      return undefined;
    }

    return user as User;
  }

  public verifyMultiTOTP(
    code1: string,
    code2: string,
    secretKey: string
  ): boolean {
    // One Time Password 1
    const window = 3;
    let code1Window = null;
    for (let errorWindow = -window; errorWindow <= +window; errorWindow++) {
      const totp = this._totpGenerator.generateTOTP(secretKey, errorWindow);
      if (code1 === totp) {
        code1Window = errorWindow;
      }
    }

    // One Time Password 2
    if (code1Window) {
      const totp = this._totpGenerator.generateTOTP(secretKey, code1Window + 1);
      if (code2 === totp) {
        return true;
      }
    }

    return false;
  }
}
