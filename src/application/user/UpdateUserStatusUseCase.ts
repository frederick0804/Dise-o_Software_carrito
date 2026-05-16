import type { IUserRepository } from '../../domain/ports/IUserRepository';
import type { IHistoryRepository } from '../../domain/ports/IHistoryRepository';
import { User } from '../../domain/entities/User';
import type { UserStatus } from '../../domain/value-objects/UserStatus';
import { createEvent } from '../../domain/events/DomainEvent';

export class UpdateUserStatusUseCase {
  constructor(
    private userRepo: IUserRepository,
    private historyRepo: IHistoryRepository,
  ) {}

  execute(userId: string, status: UserStatus): User {
    const user = this.userRepo.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const updated = user.updateStatus(status);
    this.userRepo.update(updated);

    this.historyRepo.add(
      createEvent('ACTUALIZAR_ESTADO_USUARIO', `Estado de "${user.nombres}" actualizado a ${status}`, {
        userId,
        nuevoEstado: status,
      }),
    );

    return updated;
  }
}
