import { IError } from '@utils';

export interface SignUpResponseDTO {
  statusCode: number;
  success?: undefined;
  failured?: IError;
}
