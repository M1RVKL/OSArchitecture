import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Отримуємо токен з заголовка
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Доступ заборонено. Токен відсутній.' });
  }

  try {
    // Верифікація токена за допомогою секретного ключа
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Додаємо дані користувача в об'єкт запиту, щоб використовувати їх далі
    req.user = decoded; 
    next();
  } catch (ex) {
    res.status(401).json({ error: 'Недійсний токен.' });
  }
};

export default auth;