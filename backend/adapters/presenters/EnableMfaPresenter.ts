import { EnableMfa, Output } from '@useCases';
import { HTTPView } from './HTTPView';

export class EnableMfaPresenter
  implements Output<EnableMfa.EnableMfaResponseDTO>
{
  private _view!: HTTPView;
  private _token!: {
    jwt: string;
    csrf: string;
  };

  get view(): HTTPView {
    return this._view;
  }

  get token(): {
    jwt: string;
    csrf: string;
  } {
    return this._token;
  }

  public show(response: EnableMfa.EnableMfaResponseDTO): void {
    if (response.statusCode === 200 && response.accessToken) {
      this._view = {
        statusCode: 200,
        body: response.success,
      };

      this._token = response.accessToken;
      return;
    }

    this._view = {
      statusCode: response.statusCode,
      body: response.failured,
    };

    return;
  }
}
