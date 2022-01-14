import { GetMfaSettingCode } from '@useCases';
import { IncomingHttpHeaders } from 'http';

type APIGetMfaSettingCodeInput = {
  params: unknown;
  headers?: IncomingHttpHeaders;
  body: undefined;
};

export class GetMfaSettingCodeController {
  private _input: APIGetMfaSettingCodeInput;
  private _getMfaSettingCodeInteractor: GetMfaSettingCode.GetMfaSettingCodeInteractor;

  constructor(
    input: APIGetMfaSettingCodeInput,
    interactor: GetMfaSettingCode.GetMfaSettingCodeInteractor
  ) {
    this._input = input;
    this._getMfaSettingCodeInteractor = interactor;
  }

  async run(): Promise<void> {
    const authHeader = this._input.headers?.['authorization'];
    const token =
      authHeader?.split(' ')[0] === 'Bearer' ? authHeader?.split(' ')[1] : '';

    await this._getMfaSettingCodeInteractor.execute(token);
  }
}
