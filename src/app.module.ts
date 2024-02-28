import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './db/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { UserMessageModule } from './modules/user-message/user-message.module';
import { AuthGuard } from './modules/auth/guards';

@Module({
  imports: [PrismaModule, AuthModule, ChatModule, UserMessageModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
