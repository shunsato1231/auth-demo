import { BaseRepository } from './BaseRepository';

export class SignUpRepository extends BaseRepository {
  public async checkDuplicateEmail(email: string): Promise<boolean> {
    const user = await this.abstractFind('User', { email });
    if (user === null) {
      return false;
    } else {
      return true;
    }
  }
}
