import { VerifyMfa } from '@useCases';
import { JWT_ACCESS_TOKEN_NAME } from '@utils';
import { IncomingHttpHeaders } from 'http';

type APIVerifyMfaInput = {
  params: unknown;
  headers?: IncomingHttpHeaders;
  body: VerifyMfa.VerifyMfaRequestDTO;
  cookies: { [key: string]: string };
};

export class VerifyMfaController {
  private _input: APIVerifyMfaInput;
  private _verifyMfaInteractor: VerifyMfa.VerifyMfaInteractor;

  constructor(
    input: APIVerifyMfaInput,
    interactor: VerifyMfa.VerifyMfaInteractor
  ) {
    this._input = input;
    this._verifyMfaInteractor = interactor;
  }

  async run(): Promise<void> {
    const request: VerifyMfa.VerifyMfaRequestDTO = {
      code: this._input.body.code,
    };
    const jwtAccessToken = this._input.cookies?.[JWT_ACCESS_TOKEN_NAME];
    const csrfAccessToken = this._input.headers?.['x-csrf-token'];

    await this._verifyMfaInteractor.execute(
      request,
      jwtAccessToken,
      csrfAccessToken as string
    );
  }
}
