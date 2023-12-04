import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserMessageService } from './user-message.service';
import { CreateUserMessageDto } from './dto/create-user-message.dto';

@Controller('user-message')
export class UserMessageController {
  constructor(private readonly userMessageService: UserMessageService) {}

  @Post()
  create(@Body() createUserMessageDto: CreateUserMessageDto) {
    return this.userMessageService.create(createUserMessageDto);
  }

  @Get()
  findAll() {
    return this.userMessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userMessageService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userMessageService.remove(+id);
  }
}
