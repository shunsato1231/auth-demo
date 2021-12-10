import { UniqueEntityID, User } from '@entities';

export interface IPayload {
  id: string;
  mfaVerified: boolean;
}

export interface GetMfaSettingCodeGateway {
  findUserById(id: UniqueEntityID): Promise<User | undefined>;
  generateSecreyKey(): Promise<string>;
  decodeToken<IPayload>(token: string): IPayload;
  startTransaction(): void;
  endTransaction(): Promise<void>;
  save(user: User): Promise<void>;
}
