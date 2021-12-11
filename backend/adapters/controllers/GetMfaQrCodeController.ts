import { GetMfaQrCode } from '@useCases';
import { IncomingHttpHeaders } from 'http';

type APIGetMfaQrCodeInput = {
  params: unknown;
  headers?: IncomingHttpHeaders;
  body: undefined;
};

export class GetMfaQrCodeController {
  private _input: APIGetMfaQrCodeInput;
  private _getMfaQrCodeInteractor: GetMfaQrCode.GetMfaQrCodeInteractor;

  constructor(
    input: APIGetMfaQrCodeInput,
    interactor: GetMfaQrCode.GetMfaQrCodeInteractor
  ) {
    this._input = input;
    this._getMfaQrCodeInteractor = interactor;
  }

  async run(): Promise<void> {
    const authHeader = this._input.headers?.['authorization'];
    const token =
      authHeader?.split(' ')[0] === 'Bearer' ? authHeader?.split(' ')[1] : '';
    await this._getMfaQrCodeInteractor.execute(token);
  }
}
