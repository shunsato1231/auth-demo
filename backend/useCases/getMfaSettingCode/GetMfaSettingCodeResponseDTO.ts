import { IError } from '@utils';

export interface GetMfaSettingCodeResponseDTO {
  statusCode: number;
  success?: string;
  failured?: IError;
}
