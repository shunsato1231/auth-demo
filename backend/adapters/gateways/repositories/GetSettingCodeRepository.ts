import { UniqueEntityID, User } from '@entities';
import { GetMfaSettingCode } from '@useCases';
import { TransactionalDataMappers } from '..';
import { ITOTPGenerator } from '../TOTPGenerator';
import { Token } from '../Token';
import { BaseRepository } from './BaseRepository';

export class GetMfaSettingCodeRepository
  extends BaseRepository
  implements GetMfaSettingCode.GetMfaSettingCodeGateway
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

  public generateSecreyKey(): Promise<string> {
    return this._totpGenerator.generateKey();
  }
}
