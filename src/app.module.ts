import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { UserMessageModule } from './modules/user-message/user-message.module';

@Module({
  imports: [PrismaModule, AuthModule, ChatModule, UserMessageModule],
})
export class AppModule {}
