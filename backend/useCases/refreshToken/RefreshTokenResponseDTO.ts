import { IError } from '@utils';

export interface IToken {
  accessToken: { jwt: string; csrf: string };
  refreshToken: { jwt: string; csrf: string };
}
export interface RefreshTokenResponseDTO {
  statusCode: number;
  success?: undefined;
  token?: IToken;
  failured?: IError;
}
