# 💈 Barbershop Booking — Сервис записи к мастеру

Информационная система для предварительной записи клиентов к мастерам в сети парикмахерских.

## Стек технологий

| Слой | Технология |
|------|-----------|
| Backend | NestJS (Node.js) |
| Frontend | React + TypeScript + Vite |
| БД | PostgreSQL |
| ORM | Prisma |
| Аутентификация | JWT (JSON Web Tokens) |
| Контейнеризация | Docker + Docker Compose |

## Функциональность

### Клиент
- Регистрация и вход в систему
- Просмотр списка мастеров
- Подача заявки на бронирование (выбор мастера, даты и времени)
- Просмотр своих заявок и их статусов
- Отмена заявки в статусе «Новое»

### Администратор
- Просмотр всех заявок с фильтрацией по статусу
- Изменение статуса заявки (Новое → Подтверждено / Отклонено)
- Управление мастерами (добавление, удаление)

### Статусы заявок
- 🔵 **Новое** — заявка подана, ожидает обработки
- 🟢 **Подтверждено** — администратор подтвердил запись
- 🔴 **Отклонено** — заявка отклонена

## Структура проекта

```
barbershop-booking/
├── backend/                 # NestJS сервер
│   ├── src/
│   │   ├── auth/            # Регистрация, вход, JWT
│   │   ├── users/           # Профиль пользователя
│   │   ├── masters/         # Мастера
│   │   ├── bookings/        # Заявки на бронирование
│   │   └── prisma/          # Сервис базы данных
│   └── prisma/
│       ├── schema.prisma    # Схема БД
│       └── seed.ts          # Начальные данные
└── frontend/                # React приложение
    └── src/
        ├── api/             # Взаимодействие с сервером
        ├── context/         # AuthContext (глобальное состояние)
        ├── components/      # Переиспользуемые компоненты
        └── pages/           # Страницы приложения
```

## API Endpoints

| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| POST | /api/auth/register | Регистрация | Публичный |
| POST | /api/auth/login | Вход | Публичный |
| GET | /api/users/me | Профиль | Клиент |
| GET | /api/masters | Список мастеров | Клиент |
| POST | /api/masters | Добавить мастера | Админ |
| DELETE | /api/masters/:id | Удалить мастера | Админ |
| GET | /api/bookings | Список заявок | Клиент/Админ |
| POST | /api/bookings | Создать заявку | Клиент |
| PATCH | /api/bookings/:id/status | Изменить статус | Админ |
| PATCH | /api/bookings/:id/cancel | Отменить заявку | Клиент |

## Запуск через Docker Compose

```bash
docker-compose up --build
```

После запуска:
- Фронтенд: http://localhost:5173
- Бэкенд API: http://localhost:3000/api

## Запуск для разработки

### 1. Запустить базу данных
```bash
docker-compose up db -d
```

### 2. Бэкенд
```bash
cd backend
cp .env.example .env     # настроить DATABASE_URL
npm install
npx prisma migrate dev   # применить миграции
npx prisma db seed       # заполнить начальными данными
npm run start:dev
```

### 3. Фронтенд
```bash
cd frontend
npm install
npm run dev
```

## Учётные данные по умолчанию

После выполнения seed-скрипта создаётся администратор:

| Поле | Значение |
|------|----------|
| Email | admin@barbershop.ru |
| Пароль | admin123 |

## Схема базы данных

```
User          Master        Booking
────────      ──────────    ─────────────────
id            id            id
fullName      fullName      userId  → User
phone         specialty     masterId → Master
email                       bookingDate
password                    status (NEW/CONFIRMED/REJECTED)
role                        createdAt
(CLIENT/ADMIN)              updatedAt
```
