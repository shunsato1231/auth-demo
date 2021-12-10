import { GetMfaSettingCode, Output } from '@useCases';
import { HTTPView } from './HTTPView';

export class GetMfaSettingCodePresenter
  implements Output<GetMfaSettingCode.GetMfaSettingCodeResponseDTO>
{
  private _view!: HTTPView;

  get view(): HTTPView {
    return this._view;
  }

  public show(response: GetMfaSettingCode.GetMfaSettingCodeResponseDTO): void {
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
