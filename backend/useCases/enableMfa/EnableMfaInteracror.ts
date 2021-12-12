import { UniqueEntityID, User } from '@entities';
import { Output } from '@useCases';
import { EnableMfaGateway, IPayload } from './EnableMfaGateway';
import { EnableMfaRequestDTO } from './EnableMfaRequestDTO';
import { EnableMfaResponseDTO } from './EnableMfaResponseDTO';

export class EnableMfaInteractor {
  private _gateway: EnableMfaGateway;
  private _presenter: Output<EnableMfaResponseDTO>;

  constructor(
    gateway: EnableMfaGateway,
    presenter: Output<EnableMfaResponseDTO>
  ) {
    this._gateway = gateway;
    this._presenter = presenter;
  }

  public async execute(
    data: EnableMfaRequestDTO,
    token: string
  ): Promise<void> {
    if (!token) {
      return this._presenter.show({
        statusCode: 401,
        failured: {
          resource: 'enable_mfa',
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
          resource: 'enable_mfa',
          code: 'invalid_token',
          message: 'トークンが正しくありません。ログインし直してください。',
        },
      });
    }

    if (user.mfaEnabled) {
      return this._presenter.show({
        statusCode: 403,
        failured: {
          resource: 'enable_mfa',
          code: 'already_enabled',
          message: '2段階認証は既に設定済みです。',
        },
      });
    }

    if (!user.mfaSecretKey) {
      return this._presenter.show({
        statusCode: 403,
        failured: {
          resource: 'enable_mfa',
          code: 'invalid_mfa_secret_key',
          message:
            '二段階認証設定用のキーが生成されていません。設定をやり直してください',
        },
      });
    }

    if (!data.code1 || !data.code2) {
      return this._presenter.show({
        statusCode: 401,
        failured: {
          resource: 'enable_mfa',
          code: 'invalid_parameter',
          message: '認証に失敗しました',
          errors: [
            {
              field: 'code',
              code: 'missing_field',
              message: 'ワンタイムパスワードが入力されていません。',
            },
          ],
        },
      });
    }

    if (
      !this._gateway.verifyMultiTOTP(data.code1, data.code2, user.mfaSecretKey)
    ) {
      return this._presenter.show({
        statusCode: 401,
        failured: {
          resource: 'enable_mfa',
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

    const updatedUserResult = User.build(
      {
        email: user.email,
        password: user.password,
        mfaSecretKey: user.mfaSecretKey,
        mfaEnabled: true,
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
    let newToken;

    try {
      this._gateway.startTransaction();
      await this._gateway.save(updatedUser);
      await this._gateway.endTransaction();
      newToken = this._gateway.createToken({
        id: user.id.toString(),
        mfaVerified: true,
      });
    } catch {
      return this._presenter.show({
        statusCode: 500,
        failured: {
          resource: 'enable_mfa',
          code: 'unexpected_failure',
          message: 'ユーザ情報の更新に失敗しました',
        },
      });
    }

    return this._presenter.show({
      statusCode: 200,
      success: newToken,
    });
  }
}
