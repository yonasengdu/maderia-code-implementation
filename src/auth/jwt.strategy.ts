import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { hotel } from '@prisma/client';

/**
 * the JwtStrategy class will be used by the guard on protected endpoints to
 * verify that a client requesting that endpoint has sent a valid jwt token.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt', // this is a key thing that identifies this strategy as a jwt validation strategy
) {
  constructor(
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'the way we do things',
    });
  }

  /**
   * when the strategy is used, this method gets called and the 'decoded' jwt will be passed to it
   * @param payload this is the decoded jwt that we get from the guard
   */
  async validate(payload: any) {
    const isHotel: boolean = payload.client_type == 1;
    // we check if the dto is that of a user or a hotel, fetch the client from the database and
    // return it (so that it gets appended on the request for the guarded controller like 'request.user')
    if (isHotel) {
      const hotel: hotel = await this.prisma.hotel.findUnique({
        where: {
          id: payload.sub,
        },
      });
      delete hotel.password_hash
      // whatever this method returns, it gets appended on the request object as a 'user' (request.user)
      return hotel;
    } else {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });
      delete user.password_hash
      // whatever this method returns, it gets appended on the request object as a user (request.user)
      return user;
    }
  }
}
