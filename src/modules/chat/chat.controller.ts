import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators';
import { UserEntity } from '../auth/entites/user.entity';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  findAll(@CurrentUser() user: UserEntity) {
    return this.chatService.findAll(user.id);
  }
}
