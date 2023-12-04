import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { UserRepository } from 'src/repositories/auth';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '20d' },
    }),
  ],
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
