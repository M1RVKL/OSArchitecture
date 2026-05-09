import { DomainError } from '../../domain/exceptions/DomainError.js';

export const errorHandler = (err, req, res, next) => {
     console.error('[Error]:', err.message);

    if (err instanceof DomainError) {
        return res.status(400).json({
            type: 'DomainError',
            error: err.message
        });
    }

    if (err.message.includes('не знайдено')) {
        return res.status(404).json({
            type: 'NotFoundError',
            error: err.message
        });
    }

    res.status(500).json({
        type: 'InternalServerError',
        error: 'Внутрішня помилка сервера. Ми вже працюємо над цим.'
    });
};