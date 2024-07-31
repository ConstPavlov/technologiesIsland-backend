import jwt from 'jsonwebtoken';
import { Token } from '../models/models.js'

class TokenService {
  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_KEY, {    expiresIn: '30m'});
    const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, {    expiresIn: '30d'});

    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({where: { userId }})

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save()

    }

    const token = await Token.create({userId, refreshToken})

    return token;
  }
}


export default new TokenService()