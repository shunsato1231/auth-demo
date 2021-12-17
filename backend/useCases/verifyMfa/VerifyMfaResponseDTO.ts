import { IError } from '@utils';

export interface IToken {
  jwt: string;
  csrf: string;
}
export interface VerifyMfaResponseDTO {
  statusCode: number;
  success?: string;
  token?: IToken;
  failured?: IError;
}
