import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateUserMessageDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsInt()
  @IsNotEmpty()
  messageId: number;
}
