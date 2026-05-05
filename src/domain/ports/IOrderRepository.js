export class IOrderRepository {
  /**
   * Зберігає нове замовлення або оновлює існуюче
   * @param {Order} order - Доменна сутність Order
   */
  async save(order) {
    throw new Error('Метод save() має бути реалізований в Infrastructure шарі (наприклад, через Prisma)');
  }

  /**
   * Шукає замовлення за його ID
   * @param {string} id - UUID замовлення
   * @returns {Promise<Order|null>} - Повертає доменну сутність або null
   */
  async findById(id) {
    throw new Error('Метод findById() має бути реалізований в Infrastructure шарі');
  }
}