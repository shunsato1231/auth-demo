import { UniqueEntityID } from '@entities';
import { Output, RefreshToken } from '@useCases';
import { RefreshTokenResponseDTO } from '.';

export class RefreshTokenInteractor {
  private _gateway: RefreshToken.RefreshTokenGateway;
  private _presenter: Output<RefreshTokenResponseDTO>;

  constructor(
    gateway: RefreshToken.RefreshTokenGateway,
    presenter: Output<RefreshTokenResponseDTO>
  ) {
    this._gateway = gateway;
    this._presenter = presenter;
  }

  public async execute(refreshToken: string): Promise<void> {
    let id;
    try {
      const payload = await this._gateway.verifyToken(refreshToken);
      id = payload.id;
    } catch (err) {
      return this._presenter.show({
        statusCode: 401,
        failured: {
          resource: 'refresh_token',
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
          resource: 'refreshToken',
          code: 'invalid_token',
          message: 'トークンが正しくありません。ログインし直してください。',
        },
      });
    }

    try {
      const accessToken = await this._gateway.createAccessToken({
        id: user.id.toString(),
        mfaVerified: false,
      });

      const refreshToken = await this._gateway.createRefreshToken({
        id: user.id.toString(),
      });

      return this._presenter.show({
        statusCode: 200,
        success: {
          accessToken,
          refreshToken,
        },
      });
    } catch {
      return this._presenter.show({
        statusCode: 500,
        failured: {
          resource: 'refresh',
          code: 'unexpected_failure',
          message: 'トークン更新に失敗しました',
        },
      });
    }
  }
}
