import { UniqueEntityID, User } from '@entities';
import { Output, GetMfaSettingCode } from '@useCases';
import { IPayload } from '.';

export class GetMfaSettingCodeInteractor {
  private _gateway: GetMfaSettingCode.GetMfaSettingCodeGateway;
  private _presenter: Output<GetMfaSettingCode.GetMfaSettingCodeResponseDTO>;

  constructor(
    gateway: GetMfaSettingCode.GetMfaSettingCodeGateway,
    presenter: Output<GetMfaSettingCode.GetMfaSettingCodeResponseDTO>
  ) {
    this._gateway = gateway;
    this._presenter = presenter;
  }

  public async execute(token: string): Promise<void> {
    if (!token) {
      return this._presenter.show({
        statusCode: 401,
        failured: {
          resource: 'get_mfa_setting_code',
          code: 'invalid_token',
          message: 'トークンが正しくありません。ログインし直してください。',
        },
      });
    }
    const { id } = this._gateway.decodeToken<IPayload>(token);
    const user = await this._gateway.findUserById(new UniqueEntityID(id));

    if (!user) {
      return this._presenter.show({
        statusCode: 401,
        failured: {
          resource: 'get_mfa_setting_code',
          code: 'invalid_token',
          message: 'トークンが正しくありません。ログインし直してください。',
        },
      });
    }

    if (user.mfaEnabled) {
      return this._presenter.show({
        statusCode: 403,
        failured: {
          resource: 'get_mfa_setting_code',
          code: 'already_enabled',
          message: '2段階認証は既に設定済みです。',
        },
      });
    }

    let mfaSecretKey;
    if (!user.mfaSecretKey) {
      mfaSecretKey = await this._gateway.generateSecreyKey();
    } else {
      mfaSecretKey = user.mfaSecretKey;
    }

    const updatedUserResult = User.build(
      {
        email: user.email,
        password: user.password,
        mfaEnabled: false,
        mfaSecretKey,
      },
      user.id
    );

    if (!updatedUserResult.succeeded) {
      return this._presenter.show({
        statusCode: updatedUserResult.statusCode,
        failured: updatedUserResult.errors,
      });
    }

    const updatedUser = updatedUserResult.value;

    try {
      this._gateway.startTransaction();
      await this._gateway.save(updatedUser);
      await this._gateway.endTransaction();
      return this._presenter.show({
        statusCode: 200,
        success: updatedUser.mfaSecretKey,
      });
    } catch {
      return this._presenter.show({
        statusCode: 500,
        failured: {
          resource: 'get_mfa_setting_code',
          code: 'unexpected_failure',
          message: '取得に失敗しました',
        },
      });
    }
  }
}
