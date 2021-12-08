import { Output, SignIn } from '@useCases';
import { SignInRequestDTO } from './SignInRequestDTO';
import { SignInResponseDTO } from './SignInResponseDTO';

export class SignInInteractor {
  private _gateway: SignIn.SignInGateway;
  private _presenter: Output<SignInResponseDTO>;

  constructor(
    gateway: SignIn.SignInGateway,
    presenter: Output<SignInResponseDTO>
  ) {
    this._gateway = gateway;
    this._presenter = presenter;
  }

  public async execute(data: SignInRequestDTO): Promise<void> {
    const user = await this._gateway.findUserByEmail(data.email);
    if (!user) {
      return this._presenter.show({
        statusCode: 404,
        failured: {
          resource: 'signin',
          code: 'user_not_found',
          message: 'ログインに失敗しました',
          errors: [
            {
              field: 'email',
              code: 'not_found',
              message: '登録されていないメールアドレスです。',
            },
          ],
        },
      });
    }

    if (!user.comparePassword(data.password)) {
      return this._presenter.show({
        statusCode: 401,
        failured: {
          resource: 'signin',
          code: 'invalid_password',
          message: 'ログインに失敗しました',
          errors: [
            {
              field: 'password',
              code: 'invalid',
              message: 'パスワードが間違えています。',
            },
          ],
        },
      });
    }

    let token;

    try {
      token = this._gateway.createToken({
        id: user.id.toString(),
        mfaVerified: false,
      });
    } catch {
      return this._presenter.show({
        statusCode: 500,
        failured: {
          resource: 'signUp',
          code: 'unexpected_failure',
          message: '新規登録に失敗しました',
        },
      });
    }

    return this._presenter.show({
      statusCode: 200,
      success: {
        email: user.email,
        mfaEnabled: user.mfaEnabled,
        token,
      },
    });
  }
}
