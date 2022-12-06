import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HotelAuthDto, UserAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('userSignup')
  userSignup(@Body() dto: UserAuthDto) {
    return this.authService.userSignup(dto);
  }
  @Post('hotelSignup')
  hotelSignup(@Body() dto: HotelAuthDto) {
    return this.authService.hotelSignup(dto);
  }
}
