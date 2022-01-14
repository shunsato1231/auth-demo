import { RefreshToken } from '@useCases';
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
    const authHeader = this._input.headers?.['authorization'];
    const token =
      authHeader?.split(' ')[0] === 'Bearer' ? authHeader?.split(' ')[1] : '';

    await this._enableMfaInteractor.execute(token);
  }
}
