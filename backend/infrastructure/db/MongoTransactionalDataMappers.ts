import { Mongoose, ClientSession } from 'mongoose';
import { Gateways } from '@adapters';
import MongoUserMapper from './entityMappers/MongoUserMapper';

interface EntityDataMappers {
  [entity: string]: Gateways.DataMappers;
}

export class MongoTransactionalDataMappers
  implements Gateways.TransactionalDataMappers
{
  private _session: ClientSession | undefined;
  private _mappers: EntityDataMappers;
  private _db: Mongoose;

  constructor(connections: Mongoose) {
    this._db = connections;
    this._session = undefined;
    this._mappers = {};
  }

  private _buildEntityMapper(entity: string) {
    switch (entity) {
      case 'User':
        return new MongoUserMapper(this._session);
      default:
        throw new Error(`There is no initialized Mapper for ${entity} entity`);
    }
  }

  public async startTransaction(): Promise<void> {
    this._session = await this._db.startSession();
    this._session.startTransaction();
  }

  public getEntityMapper(entityName: string): Gateways.DataMappers {
    if (!this._mappers[entityName]) {
      this._mappers[entityName] = this._buildEntityMapper(entityName);
    }

    return this._mappers[entityName];
  }

  public async commitTransaction(): Promise<void> {
    if (!this._session) {
      return;
    }

    await this._session.commitTransaction();
    this._session = undefined;
  }

  public async rollbackTransaction(): Promise<void> {
    if (!this._session) {
      return;
    }

    await this._session.abortTransaction();
    this._session = undefined;
  }
}
