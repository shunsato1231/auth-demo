import { SignIn, Output } from '@useCases';
import { HTTPView } from './HTTPView';

export class SignInPresenter implements Output<SignIn.SignInResponseDTO> {
  private _view!: HTTPView;
  private _token!: SignIn.IToken;

  get view(): HTTPView {
    return this._view;
  }

  get token(): SignIn.IToken {
    return this._token;
  }

  public show(response: SignIn.SignInResponseDTO): void {
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
