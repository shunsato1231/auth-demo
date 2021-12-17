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

  public async execute(
    jwtAccessToken: string,
    csrfAccessToken: string
  ): Promise<void> {
    if (!jwtAccessToken || !csrfAccessToken) {
      return this._presenter.show({
        statusCode: 401,
        failured: {
          resource: 'get_mfa_setting_code',
          code: 'invalid_token',
          message: 'トークンが正しくありません。ログインし直してください。',
        },
      });
    }
    let id;
    try {
      const payload = await this._gateway.verifyAccessToken<IPayload>(
        jwtAccessToken,
        csrfAccessToken
      );
      id = payload.id;
    } catch (err) {
      return this._presenter.show({
        statusCode: 400,
        failured: {
          resource: 'mfa_code',
          code: 'invalid_token',
          message: 'トークンが正しくありません。ログインし直してください。',
        },
      });
    }
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
      } catch {
        return this._presenter.show({
          statusCode: 500,
          failured: {
            resource: 'get_mfa_setting_code',
            code: 'unexpected_failure',
            message: 'ユーザ情報の更新に失敗しました',
          },
        });
      }
    } else {
      mfaSecretKey = user.mfaSecretKey;
    }

    return this._presenter.show({
      statusCode: 200,
      success: mfaSecretKey,
    });
  }
}
