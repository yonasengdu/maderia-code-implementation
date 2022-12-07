import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { idText } from 'typescript';
import { AuthService } from './auth.service';
import { HotelSignupDto, UserSigninDto, UserSignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('userSignup')
  userSignup(@Body() dto: UserSignupDto) {
    return this.authservice.userSignup(dto);
  }
  @Post('hotelSignup')
  hotelSignup(@Body() dto: HotelSignupDto) {
    return this.authservice.hotelSignup(dto);
  }

  @Post('hotelSignin')
  hotelSignin(@Body() dto: HotelSignupDto) {
    console.log(dto)
    return 'hello hotel';
  }

  @Post('userSignin')
  userSignin(@Body() dto: UserSigninDto) {
    return this.authservice.userSignin(dto);
  }

  @Delete('user/:id')
  deleteUser(@Param('id') id: string) {
    return this.authservice.deleteUser(id);
  }

  @Delete('hotel/:id')
  deleteHotel(@Param('id') id: string) {
    return this.authservice.deleteHotel(id);
  }
}
