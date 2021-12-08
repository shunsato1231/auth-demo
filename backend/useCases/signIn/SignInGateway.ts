import { User } from '@entities';
export interface SignInGateway {
  findUserByEmail(email: string): Promise<User | undefined>;
  createToken(payload: { id: string; mfaVerified: boolean }): string;
}
