import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from 'src/repositories/auth';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entites/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create({ name, email, password }) {
    const userExist = await this.userRepository.findByEmail(email);

    if (userExist)
      throw new HttpException('email already exists', HttpStatus.CONFLICT);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  findAll() {
    return this.userRepository.findAll();
  }

  async authenticate({
    email,
    password,
  }: LoginDto): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new HttpException('Invalid password or email', 401);

    const passwordIsEqual = await bcrypt.compare(password, user.password);

    if (!passwordIsEqual)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const token = this.jwtService.sign({
      sub: user.id,
    });

    return { token };
  }

  async findOne(
    id: number,
    returnPassword: boolean = false,
  ): Promise<UserEntity | Omit<UserEntity, 'password'>> {
    const userInfo = await this.userRepository.findOne(id);

    if (!userInfo) throw new HttpException('User not found', 404);

    const { password, ...user } = userInfo;

    if (returnPassword) return { ...user, password };

    return user;
  }
}
