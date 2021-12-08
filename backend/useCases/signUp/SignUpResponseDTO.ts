import { IError } from '@utils';

export interface SignUpResponseDTO {
  statusCode: number;
  success?: {
    email: string;
    mfaEnabled: boolean;
    token: string;
  };
  failured?: IError;
}
