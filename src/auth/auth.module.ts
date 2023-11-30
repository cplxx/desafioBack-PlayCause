import { Module } from '@nestjs/common';
import { CreateModule } from 'src/frameworks/prisma/repositories/create';
import { AuthController } from './controllers';
import { RegisterService } from './services';

// auth.module.ts
@Module({
  imports: [CreateModule.forRoot()],
  providers: [RegisterService],
  controllers: [AuthController],
  exports: [RegisterService],
})
export class AuthModule {}
