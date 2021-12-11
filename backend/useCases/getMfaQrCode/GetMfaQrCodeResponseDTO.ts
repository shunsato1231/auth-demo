import { IError } from '@utils';

export interface GetMfaQrCodeResponseDTO {
  statusCode: number;
  success?: string;
  failured?: IError;
}
