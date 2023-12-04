import { Module } from '@nestjs/common';
import { UserMessageService } from './user-message.service';
import { UserMessageController } from './user-message.controller';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { UserMessageRepository } from 'src/repositories/user-message';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, ChatModule, JwtModule],
  controllers: [UserMessageController],
  providers: [UserMessageService, UserMessageRepository],
})
export class UserMessageModule {}
