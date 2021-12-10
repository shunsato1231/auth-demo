import { IError } from '@utils';

export interface VerifyMfaResponseDTO {
  statusCode: number;
  success?: string;
  failured?: IError;
}
