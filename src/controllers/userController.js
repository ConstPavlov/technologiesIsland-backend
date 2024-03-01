import { ApiError } from '../error/ApiError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Basket } from '../models/models.js';

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  });
};

class UserController {
  async registration(req, res) {
    const { email, password, fullName, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest('Не корректный email или password'));
    }
    const canditate = await User.findOne({ where: { email } });
    if (canditate) {
      return next(ApiError.badRequest('Пользователь с таким email уже есть'));
    }

    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ email, fullName, role, password: hashPassword });
    const basket = await Basket.create({ userId: user.id });
    const token = generateJwt(user.id, user.email, user.role);

    return res.json(token);
  }
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal('Указан неверный логин или пароль'));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный логин или пароль'));
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json(token);
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json(token);
  }
}

export default new UserController();
