import { GetMfaQrCode } from '@useCases';
import { JWT_ACCESS_TOKEN_NAME } from '@utils';
import { IncomingHttpHeaders } from 'http';

type APIGetMfaQrCodeInput = {
  params: unknown;
  headers?: IncomingHttpHeaders;
  body: undefined;
  cookies: { [key: string]: string };
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
    const jwtAccessToken = this._input.cookies?.[JWT_ACCESS_TOKEN_NAME];
    const csrfAccessToken = this._input.headers?.['x-csrf-token'];

    await this._getMfaQrCodeInteractor.execute(
      jwtAccessToken,
      csrfAccessToken as string
    );
  }
}
