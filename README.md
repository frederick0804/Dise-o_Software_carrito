# 🛍️ Sistema de Carrito de Compras — Frontend

Aplicación web desarrollada con **React 18 + TypeScript + Vite 8** que implementa un sistema de carrito de compras siguiendo **Arquitectura Hexagonal (Puertos y Adaptadores)** y principios de **Domain-Driven Design (DDD)**.

> **Materia:** Diseño y Arquitectura de Software  
> **Docente:** Ing. Christian Merchan, MSc.  
> **Autor:** Frederick Torres Cando

---

## 🏗️ Arquitectura

El proyecto está organizado en cuatro capas bien definidas:

```
src/
├── domain/               ← Núcleo del negocio (sin dependencias externas)
│   ├── entities/         ← User, Product, Cart, CartItem, Order
│   ├── ports/            ← Interfaces: IUserRepository, ICartRepository...
│   ├── value-objects/    ← UserStatus, Price, Quantity
│   ├── events/           ← DomainEvent
│   └── types.ts          ← DTOs: UserProps, ProductProps, OrderProps...
│
├── application/          ← Casos de uso (lógica de negocio)
│   ├── cart/             ← AddProduct, RemoveProduct, UpdateQuantity, Checkout
│   ├── user/             ← CreateUser, UpdateUserStatus
│   ├── catalog/          ← LoadCatalogFromFile
│   └── orders/           ← GetPendingOrders
│
├── infrastructure/       ← Adaptadores concretos
│   ├── api/              ← apiClient, userApi, cartApi, catalogApi, orderApi, historyApi
│   ├── repositories/     ← LocalStorage (User, Product, Cart, History)
│   ├── queue/            ← InMemoryOrderQueue
│   └── container.ts      ← Inyección de dependencias
│
└── presentation/         ← Interfaz de usuario
    ├── pages/            ← UsersPage, CatalogPage, CartPage, OrdersPage, HistoryPage
    ├── store/            ← Zustand: userStore, cartStore, catalogStore, orderStore, historyStore
    ├── components/
    │   └── shared/       ← Alert.tsx, Badge.tsx
    └── router/           ← AppRouter.tsx
```

---

## 🎯 Patrones de Diseño Implementados

| Patrón | Dónde |
|---|---|
| **Repository** | `LocalStorageUserRepository`, `LocalStorageProductRepository`... |
| **Command** | Casos de uso: `AddProductUseCase`, `CheckoutUseCase`... |
| **Observer** | `historyStore` registra eventos de dominio |
| **Factory** | Métodos estáticos `User.create()`, `Product.create()` |
| **Queue / FIFO** | `InMemoryOrderQueue` |
| **Adapter** | `userApi.ts`, `cartApi.ts` — mapean español ↔ inglés con el backend |

---

## ⚙️ Tecnologías

- **React 18** — librería de interfaz de usuario
- **TypeScript 5** — tipado estático estricto (`erasableSyntaxOnly`)
- **Vite 8 (Rolldown)** — bundler de nueva generación
- **Zustand** — gestión de estado global
- **React Router v6** — enrutamiento del lado del cliente
- **Tailwind CSS 4** — estilos por utilidades

---

## 🚀 Instalación y Ejecución

### Requisitos previos
- Node.js 20+
- Backend corriendo en `http://localhost:5096` (ver repositorio del backend)

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm run dev

# 3. Abrir en el navegador
http://localhost:5173
```

---

## 🔗 Conexión con el Backend

El frontend se comunica con el backend ASP.NET Core mediante una API REST. La URL base está configurada en:

```typescript
// src/infrastructure/api/apiClient.ts
export const API_BASE = 'http://localhost:5096';
```

### Flujo de datos por módulo

| Módulo | Endpoint |
|---|---|
| Usuarios | `GET/POST/PATCH/DELETE /api/users` |
| Catálogo | `GET /api/catalog` · `POST /api/catalog/upload` |
| Carrito | `GET/POST/PUT/DELETE /api/cart/{userId}/...` |
| Pedidos | `POST /api/orders/checkout/{userId}` · `GET /api/orders/pending` |
| Historial | `GET /api/history` · `DELETE /api/history` |

---

## 📋 Funcionalidades

- **Usuarios** — Crear, activar/desactivar, eliminar y seleccionar el usuario activo del carrito
- **Catálogo** — Cargar productos desde el CSV del servidor, buscar por nombre o categoría
- **Carrito** — Agregar, eliminar y modificar cantidad de productos; ver total en tiempo real
- **Pedidos** — Confirmar compra (encola el pedido en el backend), ver cola FIFO, procesar siguiente
- **Historial** — Ver todas las acciones registradas (ADD, REMOVE, UPDATE, CHECKOUT), limpiar historial
