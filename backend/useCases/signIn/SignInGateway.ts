import { User } from '@entities';
export interface SignInGateway {
  findUserByEmail(email: string): Promise<User | undefined>;
  createAccessToken(payload: {
    id: string;
    mfaVerified: boolean;
  }): Promise<{ jwt: string; csrf: string }>;
  createRefreshToken(payload: {
    id: string;
  }): Promise<{ jwt: string; csrf: string }>;
}
