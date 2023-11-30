import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { CreateAccountService } from './user-use-case';

@Module({
  imports: [PrismaModule],
  providers: [CreateAccountService],
  exports: [CreateAccountService],
})
export class CreateModule {
  static forRoot() {
    return {
      module: CreateModule,
      providers: [CreateAccountService],
      exports: [CreateAccountService],
    };
  }
}
