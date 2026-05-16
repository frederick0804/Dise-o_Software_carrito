import type { DomainEvent } from '../events/DomainEvent';

export interface IHistoryRepository {
  add(event: DomainEvent): void;
  getAll(): DomainEvent[];
  clear(): void;
}
