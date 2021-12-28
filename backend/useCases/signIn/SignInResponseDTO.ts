import { IError } from '@utils';

export interface IToken {
  accessToken: { jwt: string; csrf: string };
  refreshToken: { jwt: string; csrf: string };
}
export interface SignInResponseDTO {
  statusCode: number;
  success?: {
    email: string;
    mfaEnabled: boolean;
  };
  token?: IToken;
  failured?: IError;
}