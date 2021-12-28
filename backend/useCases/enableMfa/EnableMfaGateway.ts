import { UniqueEntityID, User } from '@entities';
export interface IPayload {
  id: string;
  mfaVerified: boolean;
}
export interface EnableMfaGateway {
  findUserById(id: UniqueEntityID): Promise<User | undefined>;
  verifyAccessToken<IPayload>(jwt: string, csrf: string): Promise<IPayload>;
  verifyMultiTOTP(code1: string, code2: string, secretKey: string): boolean;
  startTransaction(): void;
  endTransaction(): Promise<void>;
  save(user: User): Promise<void>;
  createAccessToken<T>(payload: T): Promise<{ jwt: string; csrf: string }>;
}