import crypto from 'crypto';
import { Order } from '../entities/Order.js';
import { Address } from '../value-objects/Address.js';
import { DomainError } from '../exceptions/DomainError.js';

export class OrderFactory {
  /**
   * @param {import('../ports/IRestaurantRepository.js').IRestaurantRepository} restaurantRepository 
   */
  constructor(restaurantRepository) {
    if (!restaurantRepository) {
      throw new Error('OrderFactory вимагає restaurantRepository');
    }
    this.restaurantRepository = restaurantRepository;
  }

  /**
   * Створює нове замовлення
   * @param {string} customerId 
   * @param {string} restaurantId 
   * @param {Object} deliveryAddressParams
   * @returns {Promise<Order>}
   */
  async createNewOrder(customerId, restaurantId, deliveryAddressParams) {
    const restaurant = await this.restaurantRepository.findById(restaurantId);
    if (!restaurant) {
      throw new DomainError(`Ресторан з ID ${restaurantId} не знайдено`);
    }
    if (!restaurant.isActive) {
      throw new DomainError(`Ресторан "${restaurant.name}" наразі не приймає замовлення (неактивний)`);
    }

    const deliveryAddress = new Address(deliveryAddressParams);
    const newId = crypto.randomUUID();
    return new Order({
      id: newId,
      customerId: customerId,
      restaurantId: restaurantId,
      deliveryAddress: deliveryAddress
    });
  }
}