import { IError } from '@utils';

export interface SignInResponseDTO {
  statusCode: number;
  success?: {
    email: string;
    mfaEnabled: boolean;
    accessToken: string;
    refreshToken: string;
  };
  failured?: IError;
}
