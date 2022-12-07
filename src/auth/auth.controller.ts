import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HotelAuthDto, UserAuthDto } from './dto';

/**
 * The controller class for the Auth module. This class handles endpoints related
 * to authentication logic: the user-sign-up, hotel-sign-up
 */
@Controller('auth')
export class AuthController {
  /**
   * @param authService we inject the AuthService class in the AuthController
   */
  constructor(private authService: AuthService) {}

  /**
   * A controller method to service requests from new users to sign up.
   * The data passed to the method is already validated via guards in the UserAuthDto class.
   * The dto validation mechanism throws errors with appropriate error messages and codes when
   * validation of the dto fails.
   * Currently, all this controller does is call the userSignUp service, passing the dto.
   * @param dto Instance of the UserAuthDto class is passed to this method after the
   * post data gets validated.
   */
  @Post('userSignup')
  userSignup(@Body() dto: UserAuthDto) {
    return this.authService.userSignup(dto);
  }

  /**
   * Another controller method to service sign up requests from new hotels.
   * The data passed to the method is already validated via guards in the UserAuthDto class.
   * The dto validation mechanism throws errors with appropriate error messages and codes when
   * validation of the dto fails.
   * Currently, all this controller does is call the hotelSignUp service, passing the dto.
   * @param dto Instance of the UserAuthDto class is passed to this method after the post
   * data gets validated.
   */
  @Post('hotelSignup')
  hotelSignup(@Body() dto: HotelAuthDto) {
    return this.authService.hotelSignup(dto);
  }
}
