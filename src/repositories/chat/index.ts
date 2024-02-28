import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma/prisma.service';

@Injectable()
export class ChatRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async findAll() {
    const payloadTokenJwt = await this.jwtService.verify(args[1], {
      secret: process.env.JWT_SECRET,
    });
    return this.prisma.message.findMany({
      where: {
        userId: loggedUserId, // Adiciona esta linha para filtrar pelo userId
      },
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
