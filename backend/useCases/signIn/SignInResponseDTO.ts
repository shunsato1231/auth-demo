import { IError } from '@utils';

export interface SignInResponseDTO {
  statusCode: number;
  success?: {
    email: string;
    mfaEnabled: boolean;
    token: string;
  };
  failured?: IError;
}
