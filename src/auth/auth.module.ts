import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 *  A nest module that handles authentication logic. the AuthModule will have 4 endpoints (controllers):
 *  user-sign-in, hotel-sign-in, user-sign-up, and hotel-sign-up.
 */
@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
