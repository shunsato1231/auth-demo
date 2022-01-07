export interface HashedValueGenerator {
  toHash(value: string): Promise<string>;
  compareValue(value: string, hashedValue: string): Promise<boolean>;
}

export class HashedValueGeneratorFactory {
  private static _instance: HashedValueGeneratorFactory;
  private _hashedValueGenerator: HashedValueGenerator | undefined;

  public static getInstance(): HashedValueGeneratorFactory {
    if (!HashedValueGeneratorFactory._instance) {
      HashedValueGeneratorFactory._instance = new HashedValueGeneratorFactory();
    }

    return HashedValueGeneratorFactory._instance;
  }

  public initialize(generator: HashedValueGenerator): void {
    this._hashedValueGenerator = generator;
  }

  public getHashedValueGenerator(): HashedValueGenerator {
    if (!this._hashedValueGenerator) {
      throw new Error('Hashed Value Factories were not initialized');
    }

    return this._hashedValueGenerator;
  }
}
