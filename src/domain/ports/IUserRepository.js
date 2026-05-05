export class IUserRepository {
  /**
   * Зберігає нового або оновлює існуючого користувача
   * @param {User} user - Доменна сутність User
   */
  async save(user) {
    throw new Error('Метод save() має бути реалізований в Infrastructure шарі');
  }

  /**
   * Шукає користувача за ID
   * @param {string} id - UUID користувача
   * @returns {Promise<User|null>}
   */
  async findById(id) {
    throw new Error('Метод findById() має бути реалізований в Infrastructure шарі');
  }

  /**
   * Шукає користувача за електронною поштою (для перевірки унікальності)
   * @param {string} email - Строка з поштою (або значення з Value Object)
   * @returns {Promise<User|null>}
   */
  async findByEmail(email) {
    throw new Error('Метод findByEmail() має бути реалізований в Infrastructure шарі');
  }
}