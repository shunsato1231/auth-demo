import { GetMfaSettingCode } from '@useCases';
import { JWT_ACCESS_TOKEN_NAME } from '@utils';
import { IncomingHttpHeaders } from 'http';

type APIGetMfaSettingCodeInput = {
  params: unknown;
  headers?: IncomingHttpHeaders;
  body: undefined;
  cookies: { [key: string]: string };
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
    const jwtAccessToken = this._input.cookies?.[JWT_ACCESS_TOKEN_NAME];
    const csrfAccessToken = this._input.headers?.['x-csrf-token'];

    await this._getMfaSettingCodeInteractor.execute(
      jwtAccessToken,
      csrfAccessToken as string
    );
  }
}
