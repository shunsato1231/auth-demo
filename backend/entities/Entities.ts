import { UniqueEntityID } from './UniqueEntityId';
import { UniqueEntityIDGeneratorFactory } from './UniqueEntityIDGenerator';

const isEntity = (obj: unknown): obj is Entity<unknown> => {
  return obj instanceof Entity;
};

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityID;
  protected props: T;

  constructor(props: T, id?: UniqueEntityID) {
    const idGenerator =
      UniqueEntityIDGeneratorFactory.getInstance().getIdGenerator();
    this._id = id ? id : idGenerator.nextId();
    this.props = props;
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  public equals(entity?: Entity<T>): boolean {
    if (!entity || !isEntity(entity)) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this._id.equals(entity._id);
  }
}
