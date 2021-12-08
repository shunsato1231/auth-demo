import { Entity } from '@entities';

export interface DataMappers {
  find(criteria: unknown): Promise<Entity<unknown> | undefined>;
  findAll(): Promise<Entity<unknown>[] | undefined>;
  insert(e: Entity<unknown>): Promise<void>;
  update(e: Entity<unknown>): Promise<void>;
  delete(e: Entity<unknown>): Promise<void>;
}

export interface TransactionalDataMappers {
  startTransaction(): Promise<void>;
  getEntityMapper(entity: string): DataMappers;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
}
