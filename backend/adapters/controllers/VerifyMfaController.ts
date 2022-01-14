import { VerifyMfa } from '@useCases';
import { IncomingHttpHeaders } from 'http';

type APIVerifyMfaInput = {
  params: unknown;
  headers?: IncomingHttpHeaders;
  body: VerifyMfa.VerifyMfaRequestDTO;
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
    const authHeader = this._input.headers?.['authorization'];
    const token =
      authHeader?.split(' ')[0] === 'Bearer' ? authHeader?.split(' ')[1] : '';

    await this._verifyMfaInteractor.execute(request, token);
  }
}
