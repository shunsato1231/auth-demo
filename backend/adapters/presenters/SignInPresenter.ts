import { SignIn, Output } from '@useCases';
import { HTTPView } from './HTTPView';

export class SignInPresenter implements Output<SignIn.SignInResponseDTO> {
  private _view!: HTTPView;

  get view(): HTTPView {
    return this._view;
  }

  public show(response: SignIn.SignInResponseDTO): void {
    if (response.statusCode === 200) {
      this._view = {
        statusCode: 200,
        body: response.success,
      };
      return;
    }

    this._view = {
      statusCode: response.statusCode,
      body: response.failured,
    };

    return;
  }
}
