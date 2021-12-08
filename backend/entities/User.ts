import { Result, IError } from '@utils';
import { Entity, UniqueEntityID } from './';
import {
  HashedValueGenerator,
  HashedValueGeneratorFactory,
} from './HashedValueGenerator';

export interface IUser {
  email: string;
  password: string;
  mfaEnabled: boolean;
  mfaSecretKey?: string;
}

export const regex = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  // 半角英数字をそれぞれ1種類以上含む8文字以上100文字以下の正規表現
  password: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
};

export class User extends Entity<IUser> {
  private _hashedValueGenerator: HashedValueGenerator;
  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get mfaEnabled(): boolean {
    return this.props.mfaEnabled;
  }

  get mfaSecretKey(): string | undefined {
    return this.props.mfaSecretKey;
  }

  private constructor(props: IUser, id?: UniqueEntityID) {
    const hashedValueGenerator =
      HashedValueGeneratorFactory.getInstance().getHashedValueGenerator();
    super(
      {
        ...props,
        password: hashedValueGenerator.toHash(props.password),
      },
      id
    );

    this._hashedValueGenerator = hashedValueGenerator;
  }

  public comparePassword(password: string): boolean {
    return this._hashedValueGenerator.compareValue(
      password,
      this.props.password
    );
  }

  public static build(props: IUser, id?: UniqueEntityID): Result<User> {
    const error: IError = {
      resource: '',
      code: '',
      message: '',
      errors: [],
    };

    if (props.email === '') {
      error.errors?.push({
        field: 'email',
        code: 'missing_field',
        message: 'メールアドレスが入力されていません',
      });
    }

    if (props.password === '') {
      error.errors?.push({
        field: 'password',
        code: 'missing_field',
        message: 'パスワードが入力されていません',
      });
    }

    if (!id) {
      if (!regex.password.test(props.password)) {
        error.errors?.push({
          field: 'password',
          code: 'invalid_field',
          message: 'パスワードの形式が誤っています',
        });
      }

      if (!regex.email.test(props.email)) {
        error.errors?.push({
          field: 'email',
          code: 'invalid_field',
          message: 'メールアドレスの形式が正しくありません',
        });
      }
    }

    if (error.errors && error.errors.length > 0) {
      error.code = 'invalid_user_error';
      error.resource = 'invalid user object';
      error.message = 'ユーザのフィールドの形式に誤りがあります';

      return Result.fail<User>(401, error);
    }

    return Result.success<User>(new User(props, id));
  }
}
