import { IError } from '@utils';

export interface SignUpResponseDTO {
  statusCode: number;
  success?: Record<string, never>;
  failured?: IError;
}
