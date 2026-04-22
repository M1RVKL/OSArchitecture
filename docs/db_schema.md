# 🗄️ Схема Бази Даних

Система використовує PostgreSQL. 

## Основні таблиці

### `users` (Користувачі)
Зберігає всіх учасників системи. 
* `id` (UUID, PK)
* `email` (VARCHAR, Unique)
* `password_hash` (VARCHAR)
* `name` (VARCHAR)
* `phone` (VARCHAR, Unique)
* `role` (ENUM: 'CUSTOMER', 'COURIER', 'MANAGER', 'ADMIN')

### `restaurants` (Ресторани)
* `id` (UUID, PK)
* `manager_id` (UUID, FK -> users.id)
* `name` (VARCHAR)
* `address` (JSONB)
* `rating` (NUMERIC)
* `is_active` (BOOLEAN)

### `menu_items` (Позиції меню)
* `id` (UUID, PK)
* `restaurant_id` (UUID, FK -> restaurants.id)
* `name` (VARCHAR)
* `price` (NUMERIC)
* `is_available` (BOOLEAN)

### `orders` (Замовлення)
* `id` (UUID, PK)
* `customer_id` (UUID, FK -> users.id)
* `courier_id` (UUID, FK -> users.id, Nullable)
* `restaurant_id` (UUID, FK -> restaurants.id)
* `status` (ENUM: 'CREATED', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'CANCELLED')
* `total_price` (NUMERIC)
* `delivery_address` (JSONB)

### `order_items` (Деталі замовлення)
* `id` (UUID, PK)
* `order_id` (UUID, FK -> orders.id)
* `menu_item_id` (UUID, FK -> menu_items.id)
* `quantity` (INT)
* `price_at_purchase` (NUMERIC)