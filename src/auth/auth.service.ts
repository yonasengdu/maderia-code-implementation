import { ForbiddenException, Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HotelAuthDto, UserAuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { hotel, user } from '@prisma/client';
/**
 * The AuthService class is where most of the authentication logic goes in. This
 * includes writing data to and reading data from the database. It has methods
 * to sign up a user/hotel, sign in a user/hotel and delete user/hotel accounts.
 */
@Injectable()
export class AuthService {
  /**
   * We will use the PrismaService class to talk to the database, so it gets injected here. read about "dependency injection" for more.
   * @param prisma An instance of PrismaService gets passed to the constructor. This class extends the PrismaClient class that comes with prisma. It has all the necessary methods to talk to the database.
   */
  constructor(private prisma: PrismaService) {}

  /**
   * This method takes a valid UserAuthDto object and writes it to the database as a new user instance.
   * Before saving the data to database, we hash the plain password using the "argon" utility. Argon hashes
   * strings asynchronously, so this method is also asynchronous. A try-catch block will try to write to the
   * database. If the database write fails for unique constraint violations, the PrismaService will throw
   * appropriate errors. Currently, we catch those errors and throw them back, but what we actually need to do
   * is return the signup html template with an error message. Additionally, now we're returning a user object
   * upon successful signup. In future iterations, we should generate a JWT (Json Web Token), return that, and
   * redirect to the index page.
   * @param dto This is instance of the UserAuthDto (Data Transfer Object) that's received by a controller.
   * we know it is valid data because it has passed through nest guards.
   */
  async userSignup(dto: UserAuthDto) {
    //Generate password Hash for the user password
    const hash = await argon.hash(dto.password);
    // save the new user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          full_name: dto.full_name,
          user_name: dto.user_name,
          password_hash: hash.trim(),
          email: dto.email,
        },
        select: {
          full_name: true,
          user_name: true,
          password_hash: false,
          email: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            `the ${error.meta.target} credential has been taken`,
          );
        }
      }
      throw error;
    }
  }

  /**
   * This method takes a valid HotelAuthDto object and writes it to the database
   * as a new hotel instance. Before saving the data to database, we hash the plain
   * password using the “argon” utility. Argon hashes strings asynchronously, so
   * this method is also asynchronous. A try-catch block will try to write to the
   * database. If the database write fails for unique constraint violations, the
   * PrismaService will throw appropriate errors. Currently, we catch those errors
   * and throw them back, but what we actually need to do is return the signup html
   * template with an error message. Additionally, now we're returning a user object
   * upon successful signup. In future iterations, we should generate a JWT (Json Web Token),
   * return that, and redirect to the index page.
   * @param dto This is instance of the UserAuthDto (Data Transfer Object) that's
   * received by a controller. we know it is valid data because it has passed through
   * nest guards.
   */
  async hotelSignup(dto: HotelAuthDto) {
    //Generate password Hash for the user password
    const hash = await argon.hash(dto.password);
    //  save the user(hotel) in db

    try {
      const hotel = await this.prisma.hotel.create({
        data: {
          hotel_name: dto.hotel_name,
          user_name: dto.user_name,
          password_hash: hash.trim(),
          email: dto.email,
        },
        select: {
          hotel_name: true,
          user_name: true,
          password_hash: false,
          email: true,
        },
      });
      return hotel;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            `the ${error.meta.target} credential has been taken`,
          );
        }
      }
      throw error;
    }
  }

  // delete user function first checks if there is a row with given id in our database.if there is a value with the given id, it will be deleted, if not it will return null
  async deleteUser(id: string): Promise<user | object> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: +id,
      },
    });
    if (user) {
      return await this.prisma.user.delete({ where: { id: +id } });
    }
    return {
      success: false,
      msg: 'data is not found',
    };
  }
  // deleteHotel function first checks if there is a row with given id in our database.if there is a value with the given id, it will be deleted, if not it will return null
  async deleteHotel(id: string): Promise<hotel | object> {
    const user = await this.prisma.hotel.findUnique({
      where: {
        id: +id,
      },
    });
    if (user) {
      return await this.prisma.hotel.delete({ where: { id: +id } });
    }
    return {
      success: false,
      msg: 'data is not found',
    };
  }
}
