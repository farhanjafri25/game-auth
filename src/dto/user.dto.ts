import {
  IsEmail,
  IsNotEmpty,
  IsSemVer,
  IsString,
  IsStrongPassword,
} from 'class-validator';
//User request dtos for request validation
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
