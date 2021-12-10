import { UniqueEntityID, User } from '@entities';

export interface IPayload {
  id: string;
  mfaVerified: boolean;
}
export interface VerifyMfaGateway {
  findUserById(id: UniqueEntityID): Promise<User | undefined>;
  verifyTOTP(code: string, secretKey: string): boolean;
  decodeToken<IPayload>(token: string): IPayload;
  createToken(payload: IPayload): string;
}
