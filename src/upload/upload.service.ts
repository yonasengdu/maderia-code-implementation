import { ForbiddenException, Injectable } from '@nestjs/common';
import { hotel, user } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {} 
    async updateImage(userId: number, imagepath: string) {
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
        
        user = await this.prisma.user.update({
          where: {id: userId},
          data: {
            image:imagepath
          }
        })
        delete user.password_hash
        return user
      } 
      async updateHotelImage(userId: number, imagepath: string) {
        let hotel: hotel = await this.prisma.hotel.findUnique({
          where: {
            id: userId
          }
        })
        if(!hotel) {
          // if there is no such user, it might be due to a deleted-user jwt or hotels making the request.
          // so throw an exception
          throw new ForbiddenException('No hotel found with the specified credentials')
        }
        
        hotel = await this.prisma.hotel.update({
          where: {id: userId},
          data: {
            hotel_image:imagepath
          }
        })
        delete hotel.password_hash
        return hotel
      } 
    }
