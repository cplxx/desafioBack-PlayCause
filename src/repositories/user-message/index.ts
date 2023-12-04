import { Injectable } from '@nestjs/common';
import { UserMessage } from '@prisma/client';
import { Omit } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { CreateUserMessageDto } from 'src/modules/user-message/dto/create-user-message.dto';

@Injectable()
export class UserMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserIdAndMessageId(
    messageId: number,
    userId: number,
  ): Promise<UserMessage> {
    return this.prisma.userMessage.findFirst({
      where: { userId, messageId },
    });
  }

  create(
    createUserMessageDto: Omit<CreateUserMessageDto, 'token'> & {
      userId: number;
    },
  ): Promise<UserMessage> {
    return this.prisma.userMessage.create({ data: createUserMessageDto });
  }

  remove(id: number): Promise<UserMessage> {
    return this.prisma.userMessage.delete({
      where: { id },
    });
  }

  findAll(): Promise<UserMessage[]> {
    return this.prisma.userMessage.findMany({
      where: {},
      include: { message: true, user: true },
    });
  }

  findOne(id: number): Promise<UserMessage> {
    return this.prisma.userMessage.findFirst({
      where: { id },
    });
  }
}
