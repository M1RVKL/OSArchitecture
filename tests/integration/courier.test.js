test('PATCH /api/orders/:id/status має повертати 409, якщо замовлення вже взяли', async () => {
    // 1. Кур'єр А бере замовлення
    await request(app).patch(`/api/orders/${orderId}/status`).set('Authorization', tokenA).send({ status: 'DELIVERING' });
    
    // 2. Кур'єр Б намагається взяти те саме
    const res = await request(app).patch(`/api/orders/${orderId}/status`).set('Authorization', tokenB).send({ status: 'DELIVERING' });
    
    expect(res.statusCode).toBe(409); // Conflict
});