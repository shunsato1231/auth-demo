import { UniqueEntityID } from './UniqueEntityId';

export interface UniqueEntityIDGenerator {
  nextId(): UniqueEntityID;
}

export class UniqueEntityIDGeneratorFactory {
  private static _instance: UniqueEntityIDGeneratorFactory;
  private _entityIdGenerator: UniqueEntityIDGenerator | undefined;

  public static getInstance(): UniqueEntityIDGeneratorFactory {
    if (!UniqueEntityIDGeneratorFactory._instance) {
      UniqueEntityIDGeneratorFactory._instance =
        new UniqueEntityIDGeneratorFactory();
    }

    return UniqueEntityIDGeneratorFactory._instance;
  }

  public initialize(generator: UniqueEntityIDGenerator): void {
    this._entityIdGenerator = generator;
  }

  public getIdGenerator(): UniqueEntityIDGenerator {
    if (!this._entityIdGenerator) {
      throw new Error('Entity ID Factories were not initialized');
    }

    return this._entityIdGenerator;
  }
}
