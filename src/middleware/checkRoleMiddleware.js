import jwt from 'jsonwebtoken';

export default (role) => {
  return (req, res, next) => {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      const token = req.headers.authorization.split(' ')[1]; // Bearer asalaasdas
      if (!token) {
        return res.status(401).json({ message: 'Пользователь не авторизован' });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Нет доступа' });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
    }
  };
};
