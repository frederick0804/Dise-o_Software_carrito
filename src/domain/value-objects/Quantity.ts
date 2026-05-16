export class Quantity {
  private constructor(private readonly _value: number) {}

  static of(value: number): Quantity {
    if (!Number.isInteger(value) || value < 1)
      throw new Error('La cantidad debe ser un entero positivo');
    return new Quantity(value);
  }

  get value(): number {
    return this._value;
  }

  increment(): Quantity {
    return new Quantity(this._value + 1);
  }

  decrement(): Quantity {
    if (this._value <= 1) throw new Error('La cantidad mínima es 1');
    return new Quantity(this._value - 1);
  }
}
