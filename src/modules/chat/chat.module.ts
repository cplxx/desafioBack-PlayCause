import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from 'src/db/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { ChatRepository } from 'src/repositories/chat';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [ChatGateway, ChatService, ChatRepository],
  imports: [PrismaModule, JwtModule, AuthModule],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
