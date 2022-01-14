import { IError } from '@utils';

export interface EnableMfaResponseDTO {
  statusCode: number;
  success?: { accessToken: string };
  failured?: IError;
}
