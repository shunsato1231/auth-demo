import { Entity, UniqueEntityID } from '@entities';

interface EntityMap {
  [entity: string]: Entity<unknown>[];
}

export default class IdentityMap {
  private _map: EntityMap;

  constructor() {
    this._map = {};
  }

  public load(
    entityName: string,
    id: UniqueEntityID
  ): Entity<unknown> | undefined {
    if (!this._map[entityName]) return;

    return this._map[entityName].find((e: Entity<unknown>) => {
      return e.id.equals(id);
    });
  }

  public add(entity: Entity<unknown>): void {
    const entityName = entity.constructor.name;
    const registered = this.load(entityName, entity.id);

    if (registered) {
      throw new Error(
        `${entityName} of ID ${entity.id} already registered in Identity Map`
      );
    }

    if (this._map[entityName]) {
      this._map[entityName].push(entity);
    } else {
      this._map[entityName] = [entity];
    }
  }

  public remove(entity: Entity<unknown>): void {
    const entityName = entity.constructor.name;
    this._map[entityName] = this._map[entityName].filter((e) => {
      return !e.equals(entity);
    });
  }
}
