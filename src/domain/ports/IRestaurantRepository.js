export class IRestaurantRepository {
  /**
   * Зберігає або оновлює ресторан
   * @param {Restaurant} restaurant - Доменна сутність Restaurant
   */
  async save(restaurant) {
    throw new Error('Метод save() має бути реалізований в Infrastructure шарі');
  }

  /**
   * Шукає ресторан за ID
   * @param {string} id - UUID ресторану
   * @returns {Promise<Restaurant|null>}
   */
  async findById(id) {
    throw new Error('Метод findById() має бути реалізований в Infrastructure шарі');
  }
}