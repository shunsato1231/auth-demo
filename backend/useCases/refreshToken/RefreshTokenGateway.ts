import { UniqueEntityID, User } from '@entities';

export interface RefreshTokenGateway {
  verifyRefreshToken(jwt: string, csrf: string): Promise<{ id: string }>;
  findUserById(id: UniqueEntityID): Promise<User | undefined>;
  createAccessToken(payload: {
    id: string;
    mfaVerified: boolean;
  }): Promise<{ jwt: string; csrf: string }>;
  createRefreshToken(payload: {
    id: string;
  }): Promise<{ jwt: string; csrf: string }>;
}
