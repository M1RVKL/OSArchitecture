import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Доступ заборонено. Токен відсутній.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded; 
    next();
  } catch (ex) {
    res.status(401).json({ error: 'Недійсний токен.' });
  }
};

export default auth;