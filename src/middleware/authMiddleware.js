import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')
    [1]; // Bearer asalaasdas

    
    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован (проблема с токеном)' });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Пользователь не авторизован' });
  }
};
