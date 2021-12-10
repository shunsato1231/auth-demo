import { IError } from '@utils';

export interface EnableMfaResponseDTO {
  statusCode: number;
  success?: string;
  failured?: IError;
}
