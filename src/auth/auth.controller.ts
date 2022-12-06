import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { HotelAuthDto, UserAuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authservice: AuthService){}

    @Post('userSignup')
    userSignup(@Body() dto:UserAuthDto){ 
        return this.authservice.userSignup(dto)
    }
   @Post('hotelSignup')
   hotelSignup(@Body() dto:HotelAuthDto){
    return this.authservice.hotelSignup(dto)
   }
}