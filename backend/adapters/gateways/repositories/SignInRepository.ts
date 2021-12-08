import { User } from '@entities';
import { SignIn } from '@useCases';
import { BaseRepository } from './BaseRepository';

export class SignInRepository
  extends BaseRepository
  implements SignIn.SignInGateway
{
  public async findUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.abstractFind('User', { email });

    if (!user) {
      return undefined;
    }

    return user as User;
  }
}
