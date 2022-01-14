import { EnableMfa } from '@useCases';
import { IncomingHttpHeaders } from 'http';

type APIEnableMfaInput = {
  params: unknown;
  headers: IncomingHttpHeaders;
  body: EnableMfa.EnableMfaRequestDTO;
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

    const authHeader = this._input.headers?.['authorization'];
    const token =
      authHeader?.split(' ')[0] === 'Bearer' ? authHeader?.split(' ')[1] : '';

    await this._enableMfaInteractor.execute(request, token);
  }
}
