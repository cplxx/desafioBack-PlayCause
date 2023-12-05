import { IsNotEmpty, IsInt, IsJWT } from 'class-validator';

export class CreateUserMessageDto {
  @IsJWT()
  @IsNotEmpty()
  token: string;

  @IsInt()
  @IsNotEmpty()
  messageId: number;
}
