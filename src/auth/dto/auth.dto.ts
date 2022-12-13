import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto{
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Length(6)
  @IsNotEmpty()
  @IsString()
  password: string;



}

export class UserSignupDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
  @Length(6)
  @IsNotEmpty()
  @IsString()
  password: string;
}
export class HotelSignupDto {
  @IsNotEmpty()
  @IsString()
  hotel_name: string;
  @IsNotEmpty()
  @IsString()
  user_name: string;
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
  @Length(6)
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserSignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class HotelSignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserUpdateDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;
  @IsNotEmpty()
  @IsString()
  user_name: string;
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class PasswordResetDto {
  @Length(6)
  @IsNotEmpty()
  @IsString()
  old_password: string;
  @Length(6)
  @IsNotEmpty()
  @IsString()
  new_password: string;
}

export class HotelUpdateDto {
  @IsNotEmpty()
  @IsString()
  hotel_name: string;
  @IsNotEmpty()
  @IsString()
  user_name: string;
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
  @Length(6)
  @IsNotEmpty()
  @IsString()
  password: string;
};