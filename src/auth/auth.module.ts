import { Module } from '@nestjs/common';
import { CreateModule } from 'src/frameworks/prisma/repositories/create';
import { AuthController } from './controllers';
import { AuthService } from './services';

// auth.module.ts
@Module({
  imports: [CreateModule.forRoot()],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
