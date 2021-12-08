import { User } from '@entities';

export interface SignUpGateway {
  startTransaction(): void;
  endTransaction(): Promise<void>;
  save(user: User): Promise<void>;
  checkDuplicateEmail(email: string): Promise<boolean>;
  createToken(payload: { id: string; mfaVerified: boolean }): string;
}
