import { ApiError } from '../error/ApiError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Basket } from '../models/models.js';
import { v4 as uuidv4 } from 'uuid';
import mailService from '../service/mail-service.js';
import tokenService from '../service/token-service.js';
import UserDto from '../dtos/user-dto.js';
import { json } from 'sequelize';


const generateJwt = (id, fullName ,email, role) => {
  return jwt.sign({ id, fullName, email, role }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  });
};

class UserController {
  async registration(req, res, next) {
    try {
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

      const activationLink = uuidv4()
      const activationLinkForEmail = `${process.env.API_URL}/api/user/activate/${activationLink}`

      const user = await User.create({ email, fullName, role, password: hashPassword, activationLink });
      await mailService.sendActivationMail(email, activationLinkForEmail)

      
      const userDto = new UserDto(user)
      const tokens = await tokenService.generateTokens({...userDto})
      await tokenService.saveToken(userDto.id, tokens.refreshToken)
      
      const basket = await Basket.create({ userId: user.id });
      res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
  
      return res.json(tokens);
    } catch (error) {
      console.log(error)
    }
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
    const token = generateJwt(user.id, user.fullName, user.email, user.role);
    return res.json(token);
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.fullName, req.user.email, req.user.role);
    return res.json(token);
  }

  async activate(res,req) {
    try {
      res.json(['123','456'])
    } catch (error) {
      console.log(error)
    }
  }
  async refresh(res,req) {
    try {
      
    } catch (error) {
      
    }
  }
  async logout(res,req) {
    try {
      
    } catch (error) {
      
    }
  }
  async getUsers(res,req) {
    try {
      res.json(['123', '321'])
    } catch (error) {
      
    }
  }
}

export default new UserController();



// "fullName" : "Pablo",
// "email" : "pablo.spanish10@gmail.com",
// "password" : "Pablo1234"