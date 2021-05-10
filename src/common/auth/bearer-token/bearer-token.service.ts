import { Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { User } from '../models/user.interface';

@Injectable()
export class BearerTokenService {
  verifyToken(token: string) {
    try {
      return typeof this.getUserFromToken(token) === 'object';
    } catch (e) {
      throw new Error(`${e.name} : ${e.message}`);
    }
  }
  getUserFromToken(token: string): User {
    return verify(token, process.env.AUTH_API_SECRET_KEY) as User;
  }
}
