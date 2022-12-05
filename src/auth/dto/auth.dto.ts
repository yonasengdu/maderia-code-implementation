import {IsEmail, IsNotEmpty,IsString,Length} from 'class-validator';



export class userAuthDto{
   
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
export class hotelAuthDto{
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