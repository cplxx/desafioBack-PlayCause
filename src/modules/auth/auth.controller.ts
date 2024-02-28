import { Controller, Post, Body, Get } from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';
import { RegisterUsersDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { CurrentUser, IsPublic } from './decorators';
import { UserEntity } from './entites/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @IsPublic()
  register(@Body() registerDto: RegisterUsersDto): Promise<any> {
    return this.authService.create(registerDto);
  }

  @Get('users')
  findAll() {
    return this.authService.findAll();
  }

  @Post('login')
  @IsPublic()
  login(@Body() loginDto: LoginDto) {
    return this.authService.authenticate(loginDto);
  }

  @Get('who-am-i')
  whoAmI(@CurrentUser() user: UserEntity) {
    return user;
  }
}
