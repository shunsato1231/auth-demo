import { UniqueEntityID, User } from '@entities';
import { RefreshToken } from '@useCases';
import { TransactionalDataMappers } from '..';
import { Token } from '../Token';
import { BaseRepository } from './BaseRepository';

export class RefreshTokenRepository
  extends BaseRepository
  implements RefreshToken.RefreshTokenGateway
{
  constructor(
    mappers: TransactionalDataMappers,
    token: Token,
    tokenSecretKey: string
  ) {
    super(mappers, token, tokenSecretKey);
  }
  public async findUserById(id: UniqueEntityID): Promise<User | undefined> {
    const user = await this.abstractFindById('User', id);

    if (!user) {
      return undefined;
    }

    return user as User;
  }
}
