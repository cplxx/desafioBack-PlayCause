import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from '../services';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerService: RegisterService) {}
  @Post('register')
  async register(@Body() { name, email, password }: LoginParams) {
    return await this.registerService.registerAccount({
      name,
      email,
      password,
    });
  }
}

interface LoginParams {
  name: string;
  email: string;
  password: string;
}
