export class NotificationEventHandler {

    async handleOrderCreated(event) {
        console.log(`\n--- [Notification Service] Початок обробки ---`);
        console.log(`Отримано дані для замовлення: ${event.orderId}`);
        console.log(`Імітація відправки Email клієнту (ID: ${event.customerId})...`);

        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log(`✅ Email успішно "відправлено"!`);
        console.log(`--- [Notification Service] Кінець обробки ---\n`);
    }
}