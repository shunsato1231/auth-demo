import { User } from '@entities';
import { Output, SignUp } from '@useCases';

export class SignUpInteractor {
  private _gateway: SignUp.SignUpGateway;
  private _presenter: Output<SignUp.SignUpResponseDTO>;

  constructor(
    gateway: SignUp.SignUpGateway,
    presenter: Output<SignUp.SignUpResponseDTO>
  ) {
    this._gateway = gateway;
    this._presenter = presenter;
  }

  public async execute(data: SignUp.SignUpRequestDTO): Promise<void> {
    const alreadyUser = await this._gateway.checkDuplicateEmail(data.email);

    if (alreadyUser) {
      return this._presenter.show({
        statusCode: 409,
        failured: {
          resource: 'signUp',
          code: 'already_user',
          message: '新規登録に失敗しました',
          errors: [
            {
              field: 'email',
              code: 'duplicate_email',
              message: 'このメールアドレスは既に使用されています。',
            },
          ],
        },
      });
    }

    const newUserResult = await User.build({
      email: data.email,
      password: data.password,
      mfaEnabled: false,
      mfaSecretKey: '',
    });

    if (!newUserResult.succeeded) {
      return this._presenter.show({
        statusCode: newUserResult.statusCode,
        failured: newUserResult.errors,
      });
    }

    const newUser = newUserResult.value;
    try {
      this._gateway.startTransaction();
      await this._gateway.save(newUser);
      await this._gateway.endTransaction();
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
    });
  }
}
