import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './frameworks/prisma/prisma.module';
import { RepositoriesModule } from './frameworks/prisma/repositories/repositories.module';
import { ChatGateway } from './chat/chat.gateway';
@Module({
  imports: [PrismaModule, RepositoriesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
