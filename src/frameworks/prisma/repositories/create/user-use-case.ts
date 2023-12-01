import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';
import { RegisterUsersDto } from 'src/auth/dto/register-user.dto';

export interface CreateAccountProps extends RegisterUsersDto {}

@Injectable()
export class CreateAccountService {
  constructor(private readonly prisma: PrismaService) {}

  async user({
    name,
    email,
    password,
  }: CreateAccountProps): Promise<Omit<User, 'password'>> {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (foundUser) throw new HttpException('Email está sendo usado:', 409);

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
      select: {
        name: true,
        email: true,
        updatedAt: true,
        id: true,
        createdAt: true,
      },
    });

    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findByEmail(email: string): Promise<User> {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!foundUser)
      throw new HttpException('Error finding user by email:', 404);

    return foundUser;
  }
}
