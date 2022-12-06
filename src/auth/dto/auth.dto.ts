import {IsEmail, IsNotEmpty,IsString,Length} from 'class-validator';



export class UserAuthDto{
   
    @IsNotEmpty()
    @IsString()
    full_name: string
    @IsNotEmpty()
    @IsString()
    user_name: string

    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email:string
    @Length(6)
    @IsNotEmpty()
    @IsString()
    password:string
}
export class HotelAuthDto{
    @IsNotEmpty()
    @IsString()
    hotel_name: string
    @IsNotEmpty()
    @IsString()
    user_name: string
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string
    @Length(6)
    @IsNotEmpty()
    @IsString()
    password: string
}