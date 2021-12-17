import { VerifyMfa, Output } from '@useCases';
import { HTTPView } from './HTTPView';

export class VerifyMfaPresenter
  implements Output<VerifyMfa.VerifyMfaResponseDTO>
{
  private _view!: HTTPView;
  private _token!: VerifyMfa.IToken;

  get view(): HTTPView {
    return this._view;
  }

  get token(): VerifyMfa.IToken {
    return this._token;
  }

  public show(response: VerifyMfa.VerifyMfaResponseDTO): void {
    if (response.statusCode === 200 && response.token) {
      this._view = {
        statusCode: 200,
        body: response.success,
      };
      this._token = response.token;
      return;
    }

    this._view = {
      statusCode: response.statusCode,
      body: response.failured,
    };

    return;
  }
}
