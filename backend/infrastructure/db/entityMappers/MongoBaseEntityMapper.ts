import { Entity } from '@entities';
import { Gateways } from '@adapters';
import {
  ClientSession,
  Model,
  FilterQuery,
  Document,
  ObjectId,
} from 'mongoose';

export default abstract class MongoMappers<T> implements Gateways.DataMappers {
  protected _models: Model<T & Document>;
  protected _session: ClientSession | undefined;

  constructor(session: ClientSession | undefined, model: Model<T & Document>) {
    this._session = session;
    this._models = model;
  }

  public abstract toPersistence(entity: Entity<T>): T & { _id: ObjectId };
  public abstract toDomain(row: T & { _id: ObjectId }): Promise<Entity<T>>;

  public async find(criteria: unknown): Promise<Entity<T> | undefined> {
    const row = await this._models.findOne(
      criteria as FilterQuery<T & Document>,
      null,
      {
        session: this._session,
      }
    );

    if (!row) {
      return undefined;
    }

    return await this.toDomain(row as T & { _id: ObjectId });
  }

  public async findAll(): Promise<Entity<T>[] | undefined> {
    const rows = await this._models.find({}, null, { session: this._session });

    return await Promise.all(
      rows.map(async (row) => {
        return await this.toDomain(row as T & { _id: ObjectId });
      })
    );
  }

  public async insert(entity: Entity<T>): Promise<void> {
    await this._models.create([this.toPersistence(entity)], {
      session: this._session,
    });
  }

  public async update(entity: Entity<T>): Promise<void> {
    const data = this.toPersistence(entity);
    await this._models.replaceOne(
      { _id: entity.id } as FilterQuery<T & Document>,
      data as T,
      {
        session: this._session,
      }
    );
  }

  public async delete(entity: Entity<T>): Promise<void> {
    await this._models.findOneAndDelete(
      { _id: entity.id } as FilterQuery<T & Document>,
      {
        session: this._session,
      }
    );
  }
}
