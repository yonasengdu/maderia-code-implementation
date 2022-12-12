import { Body, Controller, Delete, Get, Param, Post, Render, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  HotelSignInDto,
  HotelSignupDto,
  PasswordResetDto,
  UserSignInDto,
  UserSignupDto,
  UserUpdateDto,
} from './dto';
import { JwtGuard } from './jwt.guard';

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
  userSignup(@Body() dto: UserSignupDto) {
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
  hotelSignup(@Body() dto: HotelSignupDto) {
    return this.authService.hotelSignup(dto);
  }


  @Post('hotelSignIn')
  hotelSignIn(@Body() dto: HotelSignInDto) {
    return this.authService.hotelSignIn(dto);
  }

  @Post('userSignIn')
  userSignIn(@Body() dto: UserSignInDto) {
    return this.authService.userSignIn(dto);
  }

  @Get('signin')
  @Render('sign_in')
  signInPage(){
    return {}
  }

  @Get('signup')
  @Render('sign_up')
  signUpPage(){
    return {}
  }


  @Delete('user')
  //@UseGuards(JwtGuard)
  @UseGuards(JwtGuard)
  async deleteUser(@Req() req:any) {
    const deletedUser = await this.authService.deleteUser(req.user.id)
    return {user: deletedUser}
  }

  @Delete('hotel')
  //@UseGuards(JwtGuard)
  @UseGuards(JwtGuard)
  async deleteHotel(@Req() req:any) {
    const deletedHotel = await this.authService.deleteHotel(req.user.id)
    return {user: deletedHotel}
  }

  /**
   * This controller handles updating of profile information for users.
   * @param req the request objext will be passed to the controller method (by the freamwork)
   * @param newUserInfo this instance of UserUpdateDto will contain the new user_name, email, and full_name of the user
   * that should go in place of (replace) the old ones.
   * @returns returns the newly updated user object.
   */
  @Post('userUpdate')
  @UseGuards(JwtGuard)
  async updateUser(@Req() req:any, @Body() newUserInfo: UserUpdateDto) {
    const updatedUser = await this.authService.updateUser(req.user.id, newUserInfo)
    return {user: updatedUser}
  }

  /**
   * This controller handles password reset for users.
   * @param req the request objext will be passed to the controller method (by the freamwork)
   * @param passwordInfo this instanceo of PasswordResetDto contains the old password (for verification purposes)
   * and the new password that should replace the old one.
   * @returns the user object whose password has now been changed.
   */
  @Post('userPasswordReset')
  @UseGuards(JwtGuard)
  async changeUserPassword(@Req() req:any, @Body() passwordInfo: PasswordResetDto) {
    const user = await this.authService.changeUserPassword(req.user.id, passwordInfo)
    return {
      user,
    }
  }
}


