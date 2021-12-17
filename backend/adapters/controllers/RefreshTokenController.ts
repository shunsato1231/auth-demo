import { RefreshToken } from '@useCases';
import { JWT_REFRESH_TOKEN_NAME } from '@utils';
import { IncomingHttpHeaders } from 'http';

type APIRefreshTokenInput = {
  params: unknown;
  headers: IncomingHttpHeaders;
  body: undefined;
  cookies: { [key: string]: string };
};

export class RefreshTokenController {
  private _input: APIRefreshTokenInput;
  private _enableMfaInteractor: RefreshToken.RefreshTokenInteractor;

  constructor(
    input: APIRefreshTokenInput,
    interactor: RefreshToken.RefreshTokenInteractor
  ) {
    this._input = input;
    this._enableMfaInteractor = interactor;
  }

  async run(): Promise<void> {
    const jwtRefreshToken = this._input.cookies?.[JWT_REFRESH_TOKEN_NAME];
    const csrfRefreshToken = this._input.headers?.['x-csrf-token'];

    await this._enableMfaInteractor.execute(
      jwtRefreshToken,
      csrfRefreshToken as string
    );
  }
}
