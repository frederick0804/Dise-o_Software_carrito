import { UserStatus } from '../value-objects/UserStatus';
import type { UserProps } from '../types';

export class User {
  private constructor(private props: UserProps) {}

  static create(params: Omit<UserProps, 'id' | 'estado'>): User {
    const id = crypto.randomUUID();
    return new User({ ...params, id, estado: UserStatus.ACTIVE });
  }

  static fromProps(props: UserProps): User {
    return new User(props);
  }

  get id() { return this.props.id; }
  get nombres() { return this.props.nombres; }
  get direccion() { return this.props.direccion; }
  get telefono() { return this.props.telefono; }
  get estado() { return this.props.estado; }

  updateStatus(estado: string): User {
    return new User({ ...this.props, estado });
  }

  toPlain(): UserProps {
    return { ...this.props };
  }
}
