import { IError } from '@utils';

export interface RefreshTokenResponseDTO {
  statusCode: number;
  success?: {
    accessToken: string;
    refreshToken: string;
  };
  failured?: IError;
}
