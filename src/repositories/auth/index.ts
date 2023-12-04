import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { RegisterUsersDto } from 'src/modules/auth/dto/register-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: RegisterUsersDto): Promise<Omit<User, 'password'>> {
    return this.prisma.user.create({
      data,
      select: {
        name: true,
        email: true,
        createdAt: true,
        id: true,
        updatedAt: true,
      },
    });
  }

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { email } });
  }

  findAll(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      where: {},
      select: {
        name: true,
        email: true,
        createdAt: true,
        id: true,
        updatedAt: true,
      },
    });
  }

  findOne(id: number): Promise<User> {
    return this.prisma.user.findFirst({ where: { id } });
  }
}
