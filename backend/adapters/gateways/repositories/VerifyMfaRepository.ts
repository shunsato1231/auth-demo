import { UniqueEntityID, User } from '@entities';
import { VerifyMfa } from '@useCases';
import { TransactionalDataMappers } from '..';
import { ITOTPGenerator } from '../TOTPGenerator';
import { Token } from '../Token';
import { BaseRepository } from './BaseRepository';

export class VerifyMfaRepository
  extends BaseRepository
  implements VerifyMfa.VerifyMfaGateway
{
  private _mfaSecretkeyGenerator: ITOTPGenerator;
  constructor(
    mfaSecretkeyGenerator: ITOTPGenerator,
    mappers: TransactionalDataMappers,
    token: Token,
    tokenSecretKey: string
  ) {
    super(mappers, token, tokenSecretKey);
    this._mfaSecretkeyGenerator = mfaSecretkeyGenerator;
  }
  public async findUserById(id: UniqueEntityID): Promise<User | undefined> {
    const user = await this.abstractFindById('User', id);

    if (!user) {
      return undefined;
    }

    return user as User;
  }

  public verifyTOTP(code: string, secretKey: string): boolean {
    const window = 1;
    for (let errorWindow = -window; errorWindow <= +window; errorWindow++) {
      const totp = this._mfaSecretkeyGenerator.generateTOTP(
        secretKey,
        errorWindow
      );
      if (code === totp) {
        return true;
      }
    }

    return false;
  }
}
