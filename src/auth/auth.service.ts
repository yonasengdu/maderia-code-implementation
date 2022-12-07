import { ForbiddenException, HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HotelSigninDto, HotelSignupDto, UserSigninDto, UserSignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { hotel, user } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
            `the ${error.meta.target} creadential has been taken`,
          );
        }
      }
      throw error;
    }

    //return the saved user
  }

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
            `the ${error.meta.target} creadential has been taken`,
          );
        }
      }
      throw error;
    }
  }

  async userSignin(dto: UserSigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user){
      // throw Error('the email is not registered.')
      throw new HttpException('the email is not registered',HttpStatus.FORBIDDEN);
    }

    const passwordCorrect = await argon.verify(user.password_hash, dto.password)
    if (passwordCorrect){
      return 'You are logged in as a user.';
    }
    throw new HttpException('wrong password', HttpStatus.FORBIDDEN);
  }

  async hotelSignin(dto: HotelSigninDto){
    const theHotel = await this.prisma.hotel.findUnique({
      where: {
        email: dto.email
      }
    });
    if (!theHotel){
      throw new HttpException('the email is not registerd', HttpStatus.FORBIDDEN)
    }
    const passwordCorrect = await argon.verify(theHotel.password_hash, dto.password)
    if (passwordCorrect){
      return "you are logged in as a hotel."
    }
    throw new HttpException("wrong password", HttpStatus.FORBIDDEN)
  }
  // delete user function first checks if there is a row with given id in our database.if there is a value with the given id, it will be deleted, if not it will return null
  async deleteUser(id: string): Promise<user> {
    const user = await this.prisma.user.findUnique({
        where: {
          id: +id,
        },
      });
    if (!user){
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
        if (!hotel){
            throw new ForbiddenException('invalid credentials');
            }
        const deletedHotel = await this.prisma.hotel.delete({ where: { id: +id } });
        delete deletedHotel.password_hash;
        return deletedHotel;
      }

}
    
    

