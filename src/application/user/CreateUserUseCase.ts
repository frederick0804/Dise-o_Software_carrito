import type { IUserRepository } from '../../domain/ports/IUserRepository';
import type { IHistoryRepository } from '../../domain/ports/IHistoryRepository';
import { User } from '../../domain/entities/User';
import { createEvent } from '../../domain/events/DomainEvent';

interface CreateUserDTO {
  nombres: string;
  direccion: string;
  telefono: string;
}

export class CreateUserUseCase {
  constructor(
    private userRepo: IUserRepository,
    private historyRepo: IHistoryRepository,
  ) {}

  execute(dto: CreateUserDTO): User {
    if (!dto.nombres.trim()) throw new Error('El nombre es requerido');
    if (!dto.telefono.trim()) throw new Error('El teléfono es requerido');

    const user = User.create(dto);
    this.userRepo.save(user);

    this.historyRepo.add(
      createEvent('CREAR_USUARIO', `Usuario "${user.nombres}" creado`, {
        userId: user.id,
        nombres: user.nombres,
      }),
    );

    return user;
  }
}
