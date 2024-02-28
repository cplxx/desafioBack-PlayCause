import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/repositories/auth';
import { AuthController } from './controllers';
import { AuthService } from './services';


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
