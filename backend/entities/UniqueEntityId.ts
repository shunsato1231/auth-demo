const isIdentifier = (id: unknown): id is UniqueEntityID => {
  return id instanceof UniqueEntityID;
};

export class UniqueEntityID {
  constructor(private value: unknown) {
    this.value = value;
  }

  public equals(id?: UniqueEntityID): boolean {
    if (!id || !isIdentifier(id)) {
      return false;
    }

    return id.toValue() === this.value;
  }

  public toString(): string {
    return String(this.value);
  }

  public toValue(): unknown {
    return this.value;
  }
}
