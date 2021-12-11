import { UniqueEntityID, User } from '@entities';
import { GetMfaQrCode } from '@useCases';
import { TransactionalDataMappers } from '..';
import { ITOTPGenerator } from '../TOTPGenerator';
import { IQrCodeGenerator } from '../QrCodeGenerator';
import { Token } from '../Token';
import { BaseRepository } from './BaseRepository';

export class GetMfaQrCodeRepository
  extends BaseRepository
  implements GetMfaQrCode.GetMfaQrCodeGateway
{
  private _totpGenerator: ITOTPGenerator;
  private _qrcodeGenerator: IQrCodeGenerator;
  constructor(
    totpGenerator: ITOTPGenerator,
    qrCodeGenerator: IQrCodeGenerator,
    mappers: TransactionalDataMappers,
    token: Token,
    tokenSecretKey: string
  ) {
    super(mappers, token, tokenSecretKey);
    this._totpGenerator = totpGenerator;
    this._qrcodeGenerator = qrCodeGenerator;
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

  public generateQrCode(code: string): Promise<string> {
    return this._qrcodeGenerator.generateQrCode(code);
  }
}
