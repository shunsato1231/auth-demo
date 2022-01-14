import { UniqueEntityID, User } from '@entities';

export interface RefreshTokenGateway {
  verifyToken(token: string): Promise<{ id: string }>;
  findUserById(id: UniqueEntityID): Promise<User | undefined>;
  createAccessToken(payload: {
    id: string;
    mfaVerified: boolean;
  }): Promise<string>;
  createRefreshToken(payload: { id: string }): Promise<string>;
}
