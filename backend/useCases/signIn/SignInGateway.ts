import { User } from '@entities';
export interface SignInGateway {
  findUserByEmail(email: string): Promise<User | undefined>;
  createAccessToken(payload: {
    id: string;
    mfaVerified: boolean;
  }): Promise<string>;
  createRefreshToken(payload: { id: string }): Promise<string>;
}
