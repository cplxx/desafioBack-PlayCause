import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CurrentUser } from '../auth/decorators';
import { UserEntity } from '../auth/entites/user.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  findAll(@CurrentUser() user: UserEntity) {
    console.log(user);

    return this.chatService.findAll(user.id);
  }
}
