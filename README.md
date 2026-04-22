# 🍔 Food Delivery API

![Node.js](https://img.shields.io/badge/Node.js-REST_API-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-ORM-black.svg)

Комплексна бекенд-система для сервісу доставки їжі. Забезпечує взаємодію між клієнтами, ресторанами та кур'єрами.

## Архітектура
Проєкт розділено на зони відповідальності. База даних розгортається та адмініструється окремо, взаємодія з нею відбувається через Prisma ORM за допомогою віддаленого підключення.

## Документація
Детальний опис бізнес-логіки та структури даних знаходиться у теці `docs/`:
* [🗄️ Схема Бази Даних](docs/db_schema.md)
* [⚙️ Use Cases](docs/use_cases.md)

## Налаштування для розробки

1. Клонуйте репозиторій та встановіть залежності:
   ```bash
   npm install