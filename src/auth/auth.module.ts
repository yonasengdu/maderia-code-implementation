import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

/**
 *  A nest module that handles authentication logic. the AuthModule will have 4 endpoints (controllers):
 *  user-sign-in, hotel-sign-in, user-sign-up, and hotel-sign-up.
 */
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
