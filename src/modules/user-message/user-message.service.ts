import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserMessageDto } from './dto/create-user-message.dto';
import { UserMessageRepository } from 'src/repositories/user-message';
import { ChatService } from '../chat/chat.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserMessageService {
  constructor(
    private readonly userMessageRepository: UserMessageRepository,
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserMessageDto: CreateUserMessageDto) {
    const payload: { sub: number } = await this.jwtService.verifyAsync(
      createUserMessageDto.token,
      {
        secret: process.env.JWT_SECRET,
      },
    );

    const userExist = await this.authService.findOne(payload.sub);
    const messageExist = await this.chatService.findOne(
      createUserMessageDto.messageId,
    );

    const userAlreadySaveMessage =
      await this.userMessageRepository.findByUserIdAndMessageId(
        createUserMessageDto.messageId,
        userExist.id,
      );

    if (userAlreadySaveMessage) {
      throw new HttpException('User saved this message', 409);
    }

    return this.userMessageRepository.create({
      messageId: messageExist.id,
      userId: userExist.id,
    });
  }

  findAll() {
    return this.userMessageRepository.findAll();
  }

  async findOne(id: number) {
    const userMessage = await this.userMessageRepository.findOne(id);

    if (!userMessage) throw new HttpException('userMessage not found', 404);

    return userMessage;
  }

  async remove(id: number) {
    const userMessage = await this.findOne(id);

    const remove = await this.userMessageRepository.remove(userMessage.id);

    if (!remove) throw new HttpException('failed to remove', 429);

    return remove;
  }
}
