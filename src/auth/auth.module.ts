import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

/**
 *  A nest module that handles authentication logic. the AuthModule will have 4 endpoints (controllers):
 *  user-sign-in, hotel-sign-in, user-sign-up, and hotel-sign-up.
 */
@Global()
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,PrismaService],
  exports:[]
})
export class AuthModule {}
