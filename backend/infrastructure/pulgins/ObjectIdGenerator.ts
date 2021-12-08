import { UniqueEntityID, UniqueEntityIDGenerator } from '../../entities';
import mongoose from 'mongoose';

export default class ObjectIdGenerator implements UniqueEntityIDGenerator {
  public nextId(): UniqueEntityID {
    const id = new mongoose.Types.ObjectId();
    return new UniqueEntityID(id);
  }
}
