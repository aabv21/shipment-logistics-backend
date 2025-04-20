import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { Expose } from "class-transformer";

export class RegisterUserDto {
  @Expose()
  @IsEmail({}, { message: "El email debe ser válido" })
  email!: string;

  @Expose()
  @IsString({ message: "La contraseña debe ser un texto" })
  @MinLength(8, { message: "La contraseña debe tener al menos 6 caracteres" })
  password!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MinLength(8)
  confirm_password!: string;

  @Expose()
  @IsString()
  @IsOptional()
  role!: string;

  @Expose()
  @IsString({ message: "El teléfono debe ser un texto" })
  phone!: string;

  @Expose()
  @IsString({ message: "El nombre debe ser un texto" })
  @MinLength(1, { message: "El nombre es requerido" })
  first_name!: string;

  @Expose()
  @IsString({ message: "El apellido debe ser un texto" })
  @MinLength(1, { message: "El apellido es requerido" })
  last_name!: string;
}
