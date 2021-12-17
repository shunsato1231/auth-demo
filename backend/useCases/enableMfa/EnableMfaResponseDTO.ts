import { IError } from '@utils';

export interface EnableMfaResponseDTO {
  statusCode: number;
  success?: undefined;
  accessToken?: {
    jwt: string;
    csrf: string;
  };
  failured?: IError;
}
