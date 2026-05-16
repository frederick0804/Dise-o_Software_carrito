import type { IHistoryRepository } from '../../domain/ports/IHistoryRepository';
import type { DomainEvent } from '../../domain/events/DomainEvent';

const KEY = 'carrito:history';

export class LocalStorageHistoryRepository implements IHistoryRepository {
  private load(): DomainEvent[] {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  add(event: DomainEvent): void {
    const events = this.load();
    events.unshift(event); // más recientes primero
    localStorage.setItem(KEY, JSON.stringify(events));
  }

  getAll(): DomainEvent[] {
    return this.load();
  }

  clear(): void {
    localStorage.removeItem(KEY);
  }
}
