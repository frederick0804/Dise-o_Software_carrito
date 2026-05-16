import type { IUserRepository } from '../../domain/ports/IUserRepository';
import type { UserProps } from '../../domain/types';
import { User } from '../../domain/entities/User';

const KEY = 'carrito:users';

export class LocalStorageUserRepository implements IUserRepository {
  private load(): UserProps[] {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); }
    catch { return []; }
  }

  private persist(users: UserProps[]): void {
    localStorage.setItem(KEY, JSON.stringify(users));
  }

  findAll(): User[] { return this.load().map(User.fromProps); }

  findById(id: string): User | undefined {
    const found = this.load().find(u => u.id === id);
    return found ? User.fromProps(found) : undefined;
  }

  save(user: User): void {
    const users = this.load();
    users.push(user.toPlain());
    this.persist(users);
  }

  update(user: User): void {
    this.persist(this.load().map(u => u.id === user.id ? user.toPlain() : u));
  }

  delete(id: string): void {
    this.persist(this.load().filter(u => u.id !== id));
  }
}
