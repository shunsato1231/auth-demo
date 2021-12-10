import { UniqueEntityID, User } from '@entities';
export interface IPayload {
  id: string;
  mfaVerified: boolean;
}
export interface EnableMfaGateway {
  findUserById(id: UniqueEntityID): Promise<User | undefined>;
  decodeToken<IPayload>(token: string): IPayload;
  verifyMultiTOTP(code1: string, code2: string, secretKey: string): boolean;
  startTransaction(): void;
  endTransaction(): Promise<void>;
  save(user: User): Promise<void>;
  createToken(payload: { id: string; mfaVerified: boolean }): string;
}
