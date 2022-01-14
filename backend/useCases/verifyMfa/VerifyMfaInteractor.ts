import { UniqueEntityID } from '@entities';
import { Output, VerifyMfa } from '@useCases';
import { IPayload, VerifyMfaRequestDTO } from '.';

export class VerifyMfaInteractor {
  private _gateway: VerifyMfa.VerifyMfaGateway;
  private _presenter: Output<VerifyMfa.VerifyMfaResponseDTO>;

  constructor(
    gateway: VerifyMfa.VerifyMfaGateway,
    presenter: Output<VerifyMfa.VerifyMfaResponseDTO>
  ) {
    this._gateway = gateway;
    this._presenter = presenter;
  }

  public async execute(
    data: VerifyMfaRequestDTO,
    accessToken: string
  ): Promise<void> {
    let id;
    try {
      const payload = await this._gateway.verifyToken<IPayload>(accessToken);
      id = payload.id;
    } catch (err) {
      return this._presenter.show({
        statusCode: 400,
        failured: {
          resource: 'verify_totp',
          code: 'invalid_token',
          message: 'トークンが正しくありません。ログインし直してください。',
        },
      });
    }

    const user = await this._gateway.findUserById(new UniqueEntityID(id));

    if (!user) {
      return this._presenter.show({
        statusCode: 400,
        failured: {
          resource: 'verify_totp',
          code: 'invalid_token',
          message: 'トークンが正しくありません。ログインし直してください。',
        },
      });
    }

    if (!user.mfaEnabled || !user.mfaSecretKey) {
      return this._presenter.show({
        statusCode: 403,
        failured: {
          resource: 'is_mfa_verified',
          code: 'not_enabled',
          message: '2段階認証が設定されていません。',
        },
      });
    }

    const verify = this._gateway.verifyTOTP(data.code, user.mfaSecretKey);

    if (!verify) {
      return this._presenter.show({
        statusCode: 401,
        failured: {
          resource: 'verify_totp',
          code: 'invalid_mfa_auth',
          message: '認証に失敗しました',
          errors: [
            {
              field: 'code',
              code: 'invalid_field',
              message: 'ワンタイムパスワードが正しくありません。',
            },
          ],
        },
      });
    }

    try {
      const newToken = await this._gateway.createAccessToken({
        id: user.id.toString(),
        mfaVerified: true,
      });

      return this._presenter.show({
        statusCode: 200,
        success: { accessToken: newToken },
      });
    } catch {
      return this._presenter.show({
        statusCode: 500,
        failured: {
          resource: 'signUp',
          code: 'unexpected_failure',
          message: '認証に失敗しました',
        },
      });
    }
  }
}
