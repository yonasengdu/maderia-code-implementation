import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  HotelSignInDto,
  HotelSignupDto,
  HotelUpdateDto,
  PasswordResetDto,
  updateImageDto,
  UserSignInDto,
  UserSignupDto,
  UserUpdateDto,
} from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { hotel, user } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

export enum ClientType {
  user,
  hotel,
}

/**
 * The AuthService class is where most of the authentication logic goes in. This
 * includes writing data to and reading data from the database. It has methods
 * to sign up a user/hotel, sign in a user/hotel and delete user/hotel accounts.
 */
@Injectable()
export class AuthService {
  // updateHotel( id: any, newUserInfo: HotelUpdateDto ) {
  //   throw new Error( 'Method not implemented.' );
  // }
  /**
   * We will use the PrismaService class to talk to the database, so it gets injected here. read about "dependency injection" for more.
   * @param prisma An instance of PrismaService gets passed to the constructor. This class extends the PrismaClient class that comes with prisma. It has all the necessary methods to talk to the database.
   */
  constructor(private prisma: PrismaService, private jwt: JwtService) {
  }

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
  async userSignup(dto: UserSignupDto) {
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
      });
      // here, we're returning a token (jwt) as soon as users register.
      // this means that users automatically sign in as they sign up.
      // @ts-ignore
      return await this.signToken(user.id, user.email, ClientType.user);
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
  async hotelSignup(dto: HotelSignupDto) {
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
          latitude: dto.latitude,
          longitude: dto.longitude,
        },
      });
      // we sign and return a token upon successful sign-up
      // @ts-ignore
      return await this.signToken(hotel.id, hotel.email, ClientType.hotel);
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

  async userSignIn(dto: UserSignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      // throw Error('the email is not registered.')
      throw new HttpException(
        'the email is not registered',
        HttpStatus.FORBIDDEN,
      );
    }
    const passwordCorrect = await argon.verify(
      user.password_hash,
      dto.password,
    );
    if (passwordCorrect) {
      // we sign and return a token upon successful sign-in
      return await this.signToken(user.id, user.email, ClientType.user);
    }
    throw new HttpException('wrong password', HttpStatus.FORBIDDEN);
  }

  async hotelSignIn(dto: HotelSignInDto) {
    const hotel = await this.prisma.hotel.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!hotel) {
      throw new HttpException(
        'the email is not registered',
        HttpStatus.FORBIDDEN,
      );
    }
    const passwordCorrect = await argon.verify(
      hotel.password_hash,
      dto.password,
    );
    if (passwordCorrect) {
      // we sign and return a jwt upon successful sign-in
      return await this.signToken(hotel.id, hotel.email, ClientType.hotel);
    }
    throw new HttpException('wrong password', HttpStatus.FORBIDDEN);
  }

  // delete user function first checks if there is a row with given id in our database.if there is a value with the given id, it will be deleted, if not it will return null
  async deleteUser(id: string): Promise<user> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: +id,
      },
    });
    if (!user) {
      throw new ForbiddenException('invalid credentials');
    }
    const deletedUser = await this.prisma.user.delete({ where: { id: +id } });
    delete deletedUser.password_hash;
    return deletedUser;
  }

  // deleteHotel function first checks if there is a row with given id in our database.if there is a value with the given id, it will be deleted, if not it will return null
  async deleteHotel(id: string): Promise<hotel> {
    const hotel = await this.prisma.hotel.findUnique({
      where: {
        id: +id,
      },
    });
    if (!hotel) {
      throw new ForbiddenException('invalid credentials');
    }
    const deletedHotel = await this.prisma.hotel.delete({ where: { id: +id } });
    delete deletedHotel.password_hash;
    return deletedHotel;
  }

  async signToken(
    id: number,
    email: string,
    clientType: ClientType,
  ): Promise<string> {
    const tokenData = {
      // 'sub' means id. (it's a convention in the jwt environment)
      sub: id,
      email: email,
      client_type: clientType,
    };
    const token = await this.jwt.signAsync(tokenData, {
      //TODO: pass the secret string with environment variables.
      secret: 'the way we do things',
    });
    return token
  }

  /**
   * This controller handles updates for user_name, full_name and email. Password updates are
   * handled by the 'changePassword' method.
   * @param userId The id of the user that is being updated. (the id won't be updated)
   * @param newUserInfo Instance of UserUpdateDto. It has user_name, full_name, and email in it.
   * @returns A user object with the given id after updating it.
   */
  async updateUser(userId: number, newUserInfo: UserUpdateDto) {
    // we just call update on prisma client and give it the id and updated values.
    const updatedUser: user  = await this.prisma.user.update({
      where: {id: userId},
      data: {
        full_name: newUserInfo.full_name,
        user_name: newUserInfo.user_name,
        email: newUserInfo.email,
      },
    });
    // we should remove the password hash before returning the updated user
    delete updatedUser.password_hash;
    return updatedUser
  }

  async updateHotel(hotelId: number, newHotelInfo: HotelUpdateDto) {
    // we just call update on prisma client and give it the id and updated values.
    const updatedHotel: hotel  = await this.prisma.hotel.update({
      where: {id: hotelId},
      data: {
        hotel_name: newHotelInfo.hotel_name,
        user_name: newHotelInfo.user_name,
        email: newHotelInfo.email,
        latitude: newHotelInfo.latitude,
        longitude: newHotelInfo.longitude,
      },
    });
    // we should remove the password hash before returning the updated user
    delete updatedHotel.password_hash;
    return updatedHotel;
  }

  async changeUserPassword(userId: number, passwordInfo: PasswordResetDto) {
    let user: user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if(!user) {
      // if there is no such user, it might be due to a deleted-user jwt or hotels making the request.
      // so throw an exception
      throw new ForbiddenException('No user found with the specified credentials')
    }
    const oldPasswordValid: boolean = await argon.verify(user.password_hash, passwordInfo.old_password);
    if(!oldPasswordValid) {
      throw new ForbiddenException('the old password is not correct.')
    }
    user = await this.prisma.user.update({
      where: {id: userId},
      data: {
        password_hash: await argon.hash(passwordInfo.new_password)
      }
    })
    delete user.password_hash
    return user
  }

  async changeHotelPassword(hotelId: number, passwordInfo: PasswordResetDto) {
    let hotel: hotel = await this.prisma.hotel.findUnique({
      where: {
        id: hotelId
      }
    })
    if(!hotel) {
      // if there is no such hotel, it might be due to a deleted-hotel jwt or users making the request.
      // so throw an exception
      throw new ForbiddenException('No hotel found with the specified credentials')
    }
    const oldPasswordValid: boolean = await argon.verify(hotel.password_hash, passwordInfo.old_password);
    if(!oldPasswordValid) {
      throw new ForbiddenException('the old password is not correct.')
    }
    hotel = await this.prisma.hotel.update({
      where: {id: hotelId},
      data: {
        password_hash: await argon.hash(passwordInfo.new_password)
      }
    })
    delete hotel.password_hash
    return hotel
  }

  
}

// let sample = new AuthService(new PrismaService(), new JwtService())
