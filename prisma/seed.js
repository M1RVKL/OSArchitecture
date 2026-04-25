import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Починаємо заповнення бази даних...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  const manager = await prisma.user.create({
    data: {
      email: 'manager@food.com',
      password_hash: 'hashed_qwerty',
      name: 'Олег Менеджер',
      phone: '+380501112233',
      role: 'MANAGER',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@ukr.net',
      password_hash: 'hashed_12345',
      name: 'Анна Клієнт',
      phone: '+380671112233',
      role: 'CUSTOMER',
    },
  });

  const courier = await prisma.user.create({
    data: {
      email: 'courier@speedy.com',
      password_hash: 'hashed_0000',
      name: 'Іван Кур\'єр',
      phone: '+380631112233',
      role: 'COURIER',
    },
  });

  const restaurant = await prisma.restaurant.create({
    data: {
      manager_id: manager.id,
      name: 'Пузата Хата',
      address: { street: 'вул. Хрещатик, 15', city: 'Київ', lat: 50.4501, lng: 30.5234 },
      rating: 4.8,
      is_active: true,
      menu_items: {
        create: [
          { name: 'Борщ український', price: 85.50, is_available: true },
          { name: 'Вареники з картоплею', price: 70.00, is_available: true },
          { name: 'Узвар', price: 35.00, is_available: true }
        ],
      },
    },
    include: { menu_items: true }, 
  });

  const order = await prisma.order.create({
    data: {
      customer_id: customer.id,
      courier_id: courier.id,
      restaurant_id: restaurant.id,
      status: 'DELIVERED',
      total_price: 155.50,
      delivery_address: { street: 'вул. Васильківська, 100', city: 'Київ', flat: 45 },
      order_items: {
        create: [
          {
            menu_item_id: restaurant.menu_items[0].id,
            quantity: 1,
            price_at_purchase: 85.50,
          },
          {
            menu_item_id: restaurant.menu_items[1].id,
            quantity: 1,
            price_at_purchase: 70.00,
          },
        ],
      },
    },
  });

  console.log('✅ Базу успішно заповнено!');
  console.log(`Створено тестове замовлення (ID: ${order.id}) на суму ${order.total_price} грн.`);
}

main()
  .catch((e) => {
    console.error('❌ Помилка під час сідінгу:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });