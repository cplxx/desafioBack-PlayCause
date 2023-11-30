// register.service.ts
import { Injectable } from '@nestjs/common';
import { CreateAccountService } from 'src/frameworks/prisma/repositories/create';

@Injectable()
export class RegisterService {
  constructor(private readonly createAccountService: CreateAccountService) {}

  async registerAccount({ name, email, password }) {
    return await this.createAccountService.user({ name, email, password });
  }
}
