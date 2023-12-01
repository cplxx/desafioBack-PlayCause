import { HttpException, Injectable } from '@nestjs/common';
import { CreateAccountService } from 'src/frameworks/prisma/repositories/create';
import { LoginDto } from '../dto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly createAccountService: CreateAccountService) {}

  async register({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.createAccountService.user({
      name,
      email,
      password: hashedPassword,
    });
  }

  async findAll() {
    return await this.createAccountService.findAll();
  }

  async authenticate({
    email,
    password,
  }: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.createAccountService.findByEmail(email);
    const compareOk = await bcrypt.compare(password, user.password);
    if (!compareOk) {
      throw new HttpException('Invalid password or email', 401);
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  private generateToken(user) {
    const payload = { userId: user.id, username: user.username };
    const secretKey = 'suaChaveSecreta';
    const options = { expiresIn: '1d' };

    return jwt.sign(payload, secretKey, options);
  }
}
