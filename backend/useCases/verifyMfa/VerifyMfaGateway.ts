import { UniqueEntityID, User } from '@entities';

export interface IPayload {
  id: string;
  mfaVerified: boolean;
}
export interface VerifyMfaGateway {
  findUserById(id: UniqueEntityID): Promise<User | undefined>;
  verifyTOTP(code: string, secretKey: string): boolean;
  verifyAccessToken<IPayload>(jwt: string, csrf: string): Promise<IPayload>;
  createAccessToken(payload: IPayload): Promise<{ jwt: string; csrf: string }>;
}
