import { GetMfaQrCode, Output } from '@useCases';
import { HTTPView } from './HTTPView';

export class GetMfaQrCodePresenter
  implements Output<GetMfaQrCode.GetMfaQrCodeResponseDTO>
{
  private _view!: HTTPView;

  get view(): HTTPView {
    return this._view;
  }

  public show(response: GetMfaQrCode.GetMfaQrCodeResponseDTO): void {
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
