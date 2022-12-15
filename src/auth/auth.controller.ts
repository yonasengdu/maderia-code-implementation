import { Body, Controller, Delete, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  HotelSignInDto,
  HotelSignupDto,
  HotelUpdateDto,
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
  async userSignup(@Body() dto: UserSignupDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.userSignup(dto);
    // we set a cookie in the response object that will be saved in the browser and
    // sent back with every relevant request. (now the client is logged in)
    res.cookie('token', token)
    return 'sign-up successful'
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
  async hotelSignup(@Body() dto: HotelSignupDto, @Res({ passthrough: true}) res: Response) {
    const token = await this.authService.hotelSignup(dto)
    // we set a cookie in the response object that will be saved in the browser and
    // sent back with every relevant request. (now the client is logged in)
    res.cookie('token', token)
    return 'sign-up successful'
  }


  @Post('hotelSignIn')
  async hotelSignIn(@Body() dto: HotelSignInDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.hotelSignIn(dto)
    // we set a cookie in the response object that will be saved in the browser and
    // sent back with every relevant request. (now the client is logged in)
    res.cookie('token', token)
    return "sign-in successful"
  }

  @Post('userSignIn')
  async userSignIn(@Body() dto: UserSignInDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.userSignIn(dto)
    // we set a cookie in the response object that will be saved in the browser and
    // sent back with every relevant request. (now the client is logged in)
    res.cookie('token', token)
    return 'sign-in successful'
  }

  @Get('signout')
  logout(@Res( { passthrough: true }) res: Response) {
    res.cookie('token', '')
    return "logut successful"
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


  @Delete('deleteUser')
  //@UseGuards(JwtGuard)
  @UseGuards(JwtGuard)
  async deleteUser(@Req() req:any) {
    const deletedUser = await this.authService.deleteUser(req.user.id)
    return {user: deletedUser}
  }

  @Delete('deleteHotel')
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

  @Post('hotelUpdate')
  @UseGuards(JwtGuard)
  async updateHotel(@Req() req:any, @Body() newHotelInfo: HotelUpdateDto) {
    const updatedHotel = await this.authService.updateHotel(req.user.id, newHotelInfo)
    return {user: updatedHotel}
  }

  /**
   * This controller handles password reset for users.
   * @param req the request object will be passed to the controller method (by the freamwork)
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

  /**
   * This controller handles password reset for hotels.
   * @param req the request object will be passed to the controller method (by the freamwork)
   * @param passwordInfo this instance of PasswordResetDto contains the old password (for verification purposes)
   * and the new password that should replace the old one.
   * @returns the hotel object whose password has now been changed.
   */
  @Post('hotelPasswordReset')
  @UseGuards(JwtGuard)
  async changeHotelPassword(@Req() req:any, @Body() passwordInfo: PasswordResetDto) {
    const hotel = await this.authService.changeHotelPassword(req.user.id, passwordInfo)
    return {
      hotel,
    }
  }
}


