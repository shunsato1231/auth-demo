import { EnableMfa } from '@useCases';
import { JWT_ACCESS_TOKEN_NAME } from '@utils';
import { IncomingHttpHeaders } from 'http';

type APIEnableMfaInput = {
  params: unknown;
  headers: IncomingHttpHeaders;
  body: EnableMfa.EnableMfaRequestDTO;
  cookies: { [key: string]: string };
};

export class EnableMfaController {
  private _input: APIEnableMfaInput;
  private _enableMfaInteractor: EnableMfa.EnableMfaInteractor;

  constructor(
    input: APIEnableMfaInput,
    interactor: EnableMfa.EnableMfaInteractor
  ) {
    this._input = input;
    this._enableMfaInteractor = interactor;
  }

  async run(): Promise<void> {
    const request: EnableMfa.EnableMfaRequestDTO = {
      code1: this._input.body.code1,
      code2: this._input.body.code2,
    };
    const jwtAccessToken = this._input.cookies?.[JWT_ACCESS_TOKEN_NAME];
    const csrfAccessToken = this._input.headers?.['x-csrf-token'];

    await this._enableMfaInteractor.execute(
      request,
      jwtAccessToken,
      csrfAccessToken as string
    );
  }
}
