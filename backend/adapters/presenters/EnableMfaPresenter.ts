import { EnableMfa, Output } from '@useCases';
import { HTTPView } from './HTTPView';

export class EnableMfaPresenter
  implements Output<EnableMfa.EnableMfaResponseDTO>
{
  private _view!: HTTPView;

  get view(): HTTPView {
    return this._view;
  }

  public show(response: EnableMfa.EnableMfaResponseDTO): void {
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
