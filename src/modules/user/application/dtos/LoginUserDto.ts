import { IsString } from "class-validator";
import { IsEmail } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
