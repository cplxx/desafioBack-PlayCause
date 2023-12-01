// auth.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from '../services';
import { RegisterUsersDto } from '../dto/register-user.dto';
import { LoginDto } from '../dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.authenticate(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterUsersDto): Promise<any> {
    return await this.authService.register(registerDto);
  }

  @Get('users')
  async findAll() {
    return this.authService.findAll();
  }
}
