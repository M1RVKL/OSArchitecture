import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущено на порту ${PORT}`);
    console.log(`Документація (поки що): http://localhost:${PORT}/api/health`);
});