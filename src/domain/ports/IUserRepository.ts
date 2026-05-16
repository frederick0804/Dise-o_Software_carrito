import type { User } from '../entities/User';

export interface IUserRepository {
  findAll(): User[];
  findById(id: string): User | undefined;
  save(user: User): void;
  update(user: User): void;
  delete(id: string): void;
}
