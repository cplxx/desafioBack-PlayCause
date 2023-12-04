import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.message.findMany({
      where: {},
      select: {
        id: true,
        content: true,
        userId: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
            createdAt: true,
            id: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.message.findFirst({ where: { id } });
  }
}
