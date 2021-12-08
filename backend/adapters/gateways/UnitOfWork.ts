import { Entity } from '@entities';
import IdentityMap from './IdentityMap';
import { TransactionalDataMappers } from './Mappers';

interface IUnitOfWork {
  registerNew(e: Entity<unknown>): void;
  registerClean(e: Entity<unknown>): void;
  registerDirty(e: Entity<unknown>): void;
  registerRemoved(e: Entity<unknown>): void;
  commit(): Promise<void>;
}

export class UnitOfWork implements IUnitOfWork {
  private _newObjects: Entity<unknown>[];
  private _dirtyObjects: Entity<unknown>[];
  private _removedObjects: Entity<unknown>[];
  private _identityMap: IdentityMap;
  private _dataMappers: TransactionalDataMappers;

  constructor(identityMap: IdentityMap, dataMappers: TransactionalDataMappers) {
    this._newObjects = [];
    this._dirtyObjects = [];
    this._removedObjects = [];
    this._identityMap = identityMap;
    this._dataMappers = dataMappers;
  }

  private _isOneOf(obj: Entity<unknown>, entities: Entity<unknown>[]): boolean {
    return (
      entities.filter((e) => {
        return e.equals(obj);
      }).length >= 0
    );
  }

  private _remove(obj: Entity<unknown>, entities: Entity<unknown>[]): boolean {
    let removed = false;

    const result = entities.filter((e) => {
      if (e.equals(obj)) {
        removed = true;
        return false;
      }
      return true;
    });

    entities = result;

    return removed;
  }

  public registerNew(obj: Entity<unknown>): void {
    if (obj.id === null || obj.id === undefined) {
      throw `${obj.constructor.name} ID is null or undefined`;
    }

    if (!this._isOneOf(obj, this._newObjects)) {
      throw `${
        obj.constructor.name
      } of ID ${obj.id.toValue()} already registered as New`;
    }

    if (!this._isOneOf(obj, this._dirtyObjects)) {
      throw `${
        obj.constructor.name
      } of ID ${obj.id.toValue()} already registered as Dirty`;
    }

    if (!this._isOneOf(obj, this._removedObjects)) {
      throw `${
        obj.constructor.name
      } of ID ${obj.id.toValue()} already registered as Removed`;
    }

    this._newObjects.push(obj);
    this._identityMap.add(obj);
  }

  public registerClean(obj: Entity<unknown>): void {
    if (obj.id === null || obj.id === undefined) {
      throw `${obj.constructor.name} ID is null or undefined`;
    }

    this._identityMap.add(obj);
  }

  public registerDirty(obj: Entity<unknown>): void {
    if (obj.id === null || obj.id === undefined) {
      throw `${obj.constructor.name} ID is null or undefined`;
    }

    if (!this._isOneOf(obj, this._removedObjects)) {
      throw `${
        obj.constructor.name
      } of ID ${obj.id.toValue()} already registered as Removed`;
    }

    if (
      !this._isOneOf(obj, this._dirtyObjects) &&
      !this._isOneOf(obj, this._newObjects)
    ) {
      this._dirtyObjects.push(obj);
    }
  }

  public registerRemoved(obj: Entity<unknown>): void {
    if (obj.id === null || obj.id === undefined) {
      throw `${obj.constructor.name} ID is null or undefined`;
    }

    this._identityMap.remove(obj);

    if (this._remove(obj, this._newObjects)) {
      return;
    }

    this._remove(obj, this._dirtyObjects);

    if (!this._isOneOf(obj, this._removedObjects)) {
      this._removedObjects.push(obj);
    }
  }

  private async _insertNew() {
    for (const newObject of this._newObjects) {
      await this._dataMappers
        .getEntityMapper(newObject.constructor.name)
        .insert(newObject);
    }
  }

  private async _updateDirty() {
    for (const dirtyObject of this._dirtyObjects) {
      await this._dataMappers
        .getEntityMapper(dirtyObject.constructor.name)
        .update(dirtyObject);
    }
  }

  private async _deleteRemoved() {
    for (const removedObject of this._removedObjects) {
      await this._dataMappers
        .getEntityMapper(removedObject.constructor.name)
        .delete(removedObject);
    }
  }

  public async commit(): Promise<void> {
    try {
      await this._dataMappers.startTransaction();
      await this._insertNew();
      await this._updateDirty();
      await this._deleteRemoved();
      await this._dataMappers.commitTransaction();
    } catch (err) {
      await this._dataMappers.rollbackTransaction();
      throw err;
    }
  }
}
