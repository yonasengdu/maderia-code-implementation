import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { idText } from "typescript";
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
   @Delete('user/:id')
   deleteUser(@Param('id') id:string){
    return this.authservice.deleteUser(id);
   }

   @Delete('hotel/:id')
   deleteHotel(@Param('id') id:string) {
    return this.authservice.deleteHotel(id);
   } 

}