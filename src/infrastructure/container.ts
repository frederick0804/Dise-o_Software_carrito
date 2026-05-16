// Contenedor de inyección de dependencias — conecta puertos con adaptadores
import { LocalStorageUserRepository } from './repositories/LocalStorageUserRepository';
import { LocalStorageProductRepository } from './repositories/LocalStorageProductRepository';
import { LocalStorageCartRepository } from './repositories/LocalStorageCartRepository';
import { LocalStorageHistoryRepository } from './repositories/LocalStorageHistoryRepository';
import { InMemoryOrderQueue } from './queue/InMemoryOrderQueue';

import { AddProductUseCase } from '../application/cart/AddProductUseCase';
import { RemoveProductUseCase } from '../application/cart/RemoveProductUseCase';
import { UpdateQuantityUseCase } from '../application/cart/UpdateQuantityUseCase';
import { CheckoutUseCase } from '../application/cart/CheckoutUseCase';
import { CreateUserUseCase } from '../application/user/CreateUserUseCase';
import { UpdateUserStatusUseCase } from '../application/user/UpdateUserStatusUseCase';
import { LoadCatalogFromFileUseCase } from '../application/catalog/LoadCatalogFromFileUseCase';
import { GetPendingOrdersUseCase } from '../application/orders/GetPendingOrdersUseCase';

// Repositorios (singletons)
export const userRepo = new LocalStorageUserRepository();
export const productRepo = new LocalStorageProductRepository();
export const cartRepo = new LocalStorageCartRepository();
export const historyRepo = new LocalStorageHistoryRepository();
export const orderQueue = new InMemoryOrderQueue();

// Casos de uso
export const addProductUseCase = new AddProductUseCase(cartRepo, productRepo, historyRepo);
export const removeProductUseCase = new RemoveProductUseCase(cartRepo, productRepo, historyRepo);
export const updateQuantityUseCase = new UpdateQuantityUseCase(cartRepo, historyRepo);
export const checkoutUseCase = new CheckoutUseCase(cartRepo, orderQueue, historyRepo);

export const createUserUseCase = new CreateUserUseCase(userRepo, historyRepo);
export const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepo, historyRepo);

export const loadCatalogFromFileUseCase = new LoadCatalogFromFileUseCase(productRepo);
export const getPendingOrdersUseCase = new GetPendingOrdersUseCase(orderQueue);
