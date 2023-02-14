import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, hotel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomTypeDto } from './dto.client';

@Injectable()
export class ClientService {
  async getRoomDataForHotel(hotelId: number) {
    return await this.prisma.roomType.findMany({
      where: {
        hotelId: hotelId,
      }
    })
  }
  async updateNumberOfRoomsOfRoomType(hotelId: any, roomType: {id: number, noOfRooms: number}) {
    // make sure the hotel owns the roomType
    const roomTypeData = await this.prisma.roomType.findUnique({
      where: {id: roomType.id}
    })
    if(!roomTypeData) {
      throw new NotFoundException("room type not found")
    }
    if(roomTypeData.hotelId != hotelId) {
      throw new ForbiddenException("you do not own the room type")
    }
    return await this.prisma.roomType.update({
      where: {id: roomType.id},
      data: {totalNumber: roomType.noOfRooms}
    })
  }
  async deleteRoomType(hotelId: number ,roomTypeId: number) {
    // make sure the hotel owns the roomType
    const roomType = await this.prisma.roomType.findUnique({
      where: {id: roomTypeId}
    })
    if(!roomType) {
      throw new NotFoundException("room type not found")
    }
    if(roomType.hotelId != hotelId) {
      throw new ForbiddenException("you do not own the room type")
    }
    // now delete the room type
    return await this.prisma.roomType.delete({
      where: {id: roomTypeId}
    })
  }

  async getHotelRoomTypes(hotel: Express.User) {
    return await this.prisma.roomType.findMany({
      where: {hotelId: hotel['id']}
    })
  }

  async createHotelRoomType(dto: RoomTypeDto, hotel: Express.User) {
    return await this.prisma.roomType.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        reservationLifetime: dto.reservationLifetime,
        totalNumber: dto.totalNumber,
        hotelId: hotel['id']
      }
    })
  }
  constructor(private prisma: PrismaService) {}

  /**
   * This service method get's location of a user and returns a list of the top n closest
   * hotels to that location
   * @param location the location of the user (in latutude and longitude)
   * @param n n is the number of hotels we want to fetch (e.g. top 10 or top 15)
   */
  async nearbyHotels(location: { lat: string; long: string }, n: number) {
    // let's parse the latitude and longitude of the user from strings into numbers
    let userLat = Number.parseFloat(location.lat);
    let userLong = Number.parseFloat(location.long);
    // get all the hotels from the database
    let allHotels = await this.prisma.hotel.findMany();
    // let's define a comparator function for sorting
    function compareHotels(a: hotel, b: hotel): number {
      let latA = Number.parseFloat(a.latitude);
      let longA = Number.parseFloat(a.longitude);
      let latB = Number.parseFloat(b.latitude);
      let longB = Number.parseFloat(b.longitude);
      let distanceA = Math.sqrt(
        (latA - userLat) ** 2 + (longA - userLong) ** 2,
      );
      let distanceB = Math.sqrt(
        (latB - userLat) ** 2 + (longB - userLong) ** 2,
      );
      return distanceA - distanceB;
    }
    // let's sort the hotels with our comparator function
    let nearby = allHotels.sort(compareHotels);
    // let's strip the password hashes off the hotel objects
    nearby.forEach((value)=> {delete value.password_hash})
    // return the top n
    return nearby.slice(0, n);
  }
}
