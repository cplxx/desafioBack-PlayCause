import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserRepository } from 'src/repositories/auth';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create({ name, email, password }) {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new HttpException('email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async authenticate({
    email,
    password,
  }: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid password or email', 401);
    }
    const compareOk = await bcrypt.compare(password, user.password);
    if (!compareOk) {
      throw new HttpException('Invalid password or email', 401);
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async findOne(
    id: number,
    returnPassword: boolean = false,
  ): Promise<Omit<User, 'password'> | User> {
    const userInfo = await this.userRepository.findOne(id);

    if (!userInfo) throw new HttpException('User not found', 404);

    const { password, ...user } = userInfo;

    if (returnPassword) return { ...user, password };

    return user;
  }

  private generateToken(user: Partial<User>) {
    const payload = { sub: user.id, userName: user.name };

    return this.jwtService.sign(payload);
  }
}
