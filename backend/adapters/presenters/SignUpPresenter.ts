import { SignUp, Output } from '@useCases';
import { HTTPView } from './HTTPView';

export class SignUpPresenter implements Output<SignUp.SignUpResponseDTO> {
  private _view!: HTTPView;

  get view(): HTTPView {
    return this._view;
  }

  public show(response: SignUp.SignUpResponseDTO): void {
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
