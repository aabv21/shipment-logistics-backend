import { IsDate, IsEmail, IsString } from "class-validator";

export class UserResponseDto {
  @IsString()
  id!: string;

  @IsEmail()
  email!: string;

  @IsDate()
  createdAt!: Date;

  @IsString()
  role!: string;

  @IsString()
  phone!: string;

  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;
}
