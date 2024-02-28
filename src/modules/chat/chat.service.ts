import { HttpException, Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
import { ChatRepository } from 'src/repositories/chat';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}
  findAll(userId: number) {
    return this.chatRepository.findAll(userId);
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.chatRepository.findOne(id);

    if (!message) throw new HttpException('message not found', 404);

    return message;
  }
}
