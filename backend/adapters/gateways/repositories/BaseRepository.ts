import { Entity, UniqueEntityID } from '@entities';
import IdentityMap from '../IdentityMap';
import { TransactionalDataMappers } from '../Mappers';
import { Token } from '../Token';
import { UnitOfWork } from '../UnitOfWork';
interface IRepository {
  startTransaction(): void;
  abstractFindAll(
    entityName: string,
    criteria: unknown
  ): Promise<Entity<unknown>[]>;
  abstractFind(
    entityName: string,
    criteria: unknown
  ): Promise<Entity<unknown> | null>;
  abstractFindById(
    entityName: string,
    id: UniqueEntityID
  ): Promise<Entity<unknown> | null>;
  save(e: Entity<unknown>): Promise<void>;
  saveCollection(entities: Entity<unknown>[]): Promise<void>;
  remove(e: Entity<unknown>): Promise<void>;
  removeCollection(entities: Entity<unknown>[]): Promise<void>;
  endTransaction(): Promise<void>;
  createAccessToken<T>(payload: T): Promise<string>;
  createRefreshToken<T>(payload: T): Promise<string>;
  verifyToken<T>(token: string): Promise<T>;
}

export class BaseRepository implements IRepository {
  protected uow: UnitOfWork | undefined;
  protected identityMap: IdentityMap;
  private _dataMappers: TransactionalDataMappers;
  private _token: Token;
  private _tokenSecretKey: string;

  constructor(
    dataMappers: TransactionalDataMappers,
    token: Token,
    tokenSecretKey: string
  ) {
    this.identityMap = new IdentityMap();
    this._dataMappers = dataMappers;
    this._token = token;
    this._tokenSecretKey = tokenSecretKey;
  }

  public startTransaction(): void {
    this.uow = new UnitOfWork(this.identityMap, this._dataMappers);
  }

  public async abstractFindAll(entityName: string): Promise<Entity<unknown>[]> {
    const entities = await this._dataMappers
      .getEntityMapper(entityName)
      .findAll();

    if (!entities) {
      return [];
    }

    for (const entity of entities) {
      const loaded = this.identityMap.load(entityName, entity.id);
      if (!loaded) {
        this.identityMap.add(entity);
      }
    }

    return entities;
  }

  public async abstractFind(
    entityName: string,
    criteria: unknown
  ): Promise<Entity<unknown> | null> {
    const entity = await this._dataMappers
      .getEntityMapper(entityName)
      .find(criteria);

    if (!entity) {
      return null;
    }

    this.identityMap.add(entity);
    return entity;
  }

  public async abstractFindById(
    entityName: string,
    id: UniqueEntityID
  ): Promise<Entity<unknown> | null> {
    let entity = this.identityMap.load(entityName, id);

    if (!entity) {
      entity = await this._dataMappers
        .getEntityMapper(entityName)
        .find({ _id: id.toValue() });
    }

    if (!entity) {
      return null;
    }

    this.identityMap.add(entity);
    return entity;
  }

  public async save(e: Entity<unknown>): Promise<void> {
    if (!this.uow) {
      throw new Error('There is no started transaction');
    }

    const entityName = e.constructor.name;
    const registered = this.identityMap.load(entityName, e.id);

    if (registered) {
      this.uow.registerDirty(e);
    } else {
      this.uow.registerNew(e);
    }
  }

  public async saveCollection(entities: Entity<unknown>[]): Promise<void> {
    for (const e of entities) {
      this.save(e);
    }
  }

  public async remove(e: Entity<unknown>): Promise<void> {
    if (!this.uow) {
      throw new Error('There is no started transaction');
    }

    this.uow.registerRemoved(e);
  }

  public async removeCollection(entities: Entity<unknown>[]): Promise<void> {
    for (const e of entities) {
      this.remove(e);
    }
  }

  public async endTransaction(): Promise<void> {
    if (!this.uow) {
      throw new Error('There is no started transaction');
    }

    await this.uow.commit();
    this.uow = undefined;
  }

  public async createAccessToken<T>(payload: T): Promise<string> {
    try {
      return this._token.signJwt(payload, this._tokenSecretKey, '30m');
    } catch {
      throw new Error('Failed to generate an access token');
    }
  }

  public async createRefreshToken<T>(payload: T): Promise<string> {
    try {
      return this._token.signJwt(payload, this._tokenSecretKey, '2h');
    } catch {
      throw new Error('Failed to generate an refresh token');
    }
  }

  public async verifyToken<T>(token: string): Promise<T> {
    return await this._token.verifyJwt<T>(token, this._tokenSecretKey);
  }
}
