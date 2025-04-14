import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'ФИО обязательно' })
  @IsString()
  fullName: string;

  @IsNotEmpty({ message: 'Телефон обязателен' })
  @Matches(/^\+7\d{10}$/, { message: 'Телефон должен быть в формате +7XXXXXXXXXX' })
  phone: string;

  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;
}
