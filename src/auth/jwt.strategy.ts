import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { hotel } from '@prisma/client';
import { Request } from 'express';

/**
 * the JwtStrategy class will be used by the guard on protected endpoints to
 * verify that a client requesting that endpoint has sent a valid jwt token.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT,]),
      secretOrKey: 'the way we do things',
    });
  }

  /**
   * This method is used by the strategy to extract the jwt from the request before validation
   * @param req this is the request
   * @returns the token string (if it exists in the request) or null (in which case validation fails)
   */
  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'token' in req.cookies) {
      return req.cookies.token;
    }
    return null;
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
      //if the value with specific id is not found in the database it should raise an exception
      if (!hotel){
        throw new ForbiddenException(
          `there is no match in the database`,
        );
      }
      
      delete hotel.password_hash
      // whatever this method returns, it gets appended on the request object as a 'user' (request.user)
      return hotel;
    } else {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });
      //if the value with specific id is not found in the database it should raise an exception
      if (!user){
        throw new ForbiddenException(
          `there is no match in the database`,
        );}
      delete user.password_hash
      // whatever this method returns, it gets appended on the request object as a user (request.user)
      return user;
    }
  }
}
