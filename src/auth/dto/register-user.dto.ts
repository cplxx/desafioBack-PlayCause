import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUsersDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 255)
  password: string;
}
