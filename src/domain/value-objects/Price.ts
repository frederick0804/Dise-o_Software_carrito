export class Price {
  private constructor(private readonly _value: number) {}

  static of(value: number): Price {
    if (value < 0) throw new Error('El precio no puede ser negativo');
    return new Price(value);
  }

  get value(): number {
    return this._value;
  }

  add(other: Price): Price {
    return new Price(this._value + other._value);
  }

  multiply(factor: number): Price {
    return new Price(this._value * factor);
  }

  format(): string {
    return `$${this._value.toFixed(2)}`;
  }
}
