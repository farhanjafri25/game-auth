import {
  IsEmail,
  IsNotEmpty,
  IsSemVer,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UserSignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsStrongPassword()
  @IsNotEmpty()
  confirmPassword: string;
}

export class UserLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
