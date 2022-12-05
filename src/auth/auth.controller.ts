import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { hotelAuthDto, userAuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authservice: AuthService){}

    @Post('userSignup')
    userSignup(@Body() dto:userAuthDto){ 
        return this.authservice.userSignup(dto)
    }
   @Post('hotelSignup')
   hotelSignup(@Body() dto:hotelAuthDto){
    return this.authservice.hotelSignup(dto)
   }
}