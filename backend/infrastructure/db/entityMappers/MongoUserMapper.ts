import { ClientSession, ObjectId } from 'mongoose';
import { IUser, UniqueEntityID, User } from '@entities';
import MongoMapper from './MongoBaseEntityMapper';
import { UserModel } from '../mongoose-model';

export default class MongoUserMapper extends MongoMapper<IUser> {
  constructor(session: ClientSession | undefined) {
    super(session, UserModel);
  }

  public toDomain(userRowDTO: IUser & { _id: ObjectId }): User {
    const userProps: IUser = {
      email: userRowDTO.email,
      password: userRowDTO.password,
      mfaEnabled: userRowDTO.mfaEnabled,
      mfaSecretKey: userRowDTO.mfaSecretKey,
    };

    const uniqueId = new UniqueEntityID(userRowDTO._id);
    return User.build(userProps, uniqueId).value;
  }

  public toPersistence(user: User): IUser & { _id: ObjectId } {
    return {
      _id: user.id.toValue() as ObjectId,
      email: user.email,
      password: user.password,
      mfaEnabled: user.mfaEnabled,
      mfaSecretKey: user.mfaSecretKey,
    };
  }
}
