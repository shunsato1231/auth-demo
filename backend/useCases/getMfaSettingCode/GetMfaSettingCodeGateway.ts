import { UniqueEntityID, User } from '@entities';

export interface IPayload {
  id: string;
  mfaVerified: boolean;
}

export interface GetMfaSettingCodeGateway {
  findUserById(id: UniqueEntityID): Promise<User | undefined>;
  generateSecreyKey(): Promise<string>;
  verifyToken<IPayload>(token: string): Promise<IPayload>;
  startTransaction(): void;
  endTransaction(): Promise<void>;
  save(user: User): Promise<void>;
}
