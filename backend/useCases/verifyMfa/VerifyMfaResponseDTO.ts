import { IError } from '@utils';

export interface VerifyMfaResponseDTO {
  statusCode: number;
  success?: { accessToken: string };
  failured?: IError;
}
