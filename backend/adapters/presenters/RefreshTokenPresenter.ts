import { RefreshToken, Output } from '@useCases';
import { HTTPView } from './HTTPView';

export class RefreshTokenPresenter
  implements Output<RefreshToken.RefreshTokenResponseDTO>
{
  private _view!: HTTPView;
  private _token!: RefreshToken.IToken;

  get view(): HTTPView {
    return this._view;
  }

  get token(): RefreshToken.IToken {
    return this._token;
  }

  public show(response: RefreshToken.RefreshTokenResponseDTO): void {
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
