import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';

export interface CreateAccountProps {
  email: string;
  name: string;
  password: string;
}

console.log('chegou');
@Injectable()
export class CreateAccountService {
  constructor(private readonly prisma: PrismaService) {}

  async user({ name, email, password }: CreateAccountProps): Promise<User> {
    console.log('chegouaq');
    try {
      const newUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);

      console.log('chegouaqq');
      throw new Error('Failed to create user');
    }
  }
}
