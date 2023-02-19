import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaClient, hotel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReservationDto, RoomTypeDto, SingleIdDto, UpdateReservationDto } from './dto.client';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async promoteReservationToOccupancy(user: any, data: UpdateReservationDto) {
    // check if the client is a hotel
    if(user.full_name) {
      throw new ForbiddenException("Allowed only for hotels")
    }
    // check if the reservation belongs to the hotel
    const reservation = await this.prisma.reservation.findUnique({
      where: {
        id: data.reservationId,
      }
    });
    if(!reservation) {
      throw new NotFoundException("Reservation could not be found.");
    }
    if(reservation.hotelId != user.id) {
      throw new ForbiddenException("You do not own the reservation.");
    }
    // update the reservation
    const occupancyExpiryTime = new Date();
    occupancyExpiryTime.setMinutes(occupancyExpiryTime.getMinutes() + data.occupancyLifetime)
    return await this.prisma.reservation.update({
      where: {
        id: data.reservationId,
      },
      data: {
        occupancy: true,
        occupancyLifetime: data.occupancyLifetime,
        occupancyExpiryTime: occupancyExpiryTime,
      }
    })
  }
  
  async getHotelReservationsAndOccupancies(user: any) {
    // check if the client is a hotel
    if(user.full_name) {
      throw new ForbiddenException("Allowed only for hotels.")
    }
    // then update the database, deleting expired items
    await this.updateDatabase()
    // now fetch data and send ... 
    let reservations = await this.prisma.reservation.findMany({
      where: {
        hotelId: user.id,
        occupancy: false,
      }
    });
    let occupancies = await this.prisma.reservation.findMany({
      where: {
        hotelId: user.id,
        occupancy: true,
      }
    });

    return {reservations, occupancies,}
  }

  async getUserReservations(user: any) {
    // check if the client is a user
    if (!user.full_name) {
      throw new ForbiddenException('Not allowed for hotels.');
    }
    // update the database (deleting expired reservations) before fetching live reservations
    await this.updateDatabase();
    // then fetch the live reservations
    return await this.prisma.reservation.findMany({
      where: {
        userId: user.id,
        occupancy: false,
      },
    });
  }

  async deleteUserReservation(user: any, data: SingleIdDto) {
    // check if client is user
    if (!user.full_name) {
      throw new ForbiddenException("Hotels can't make or cancel reservations.");
    }
    // check if user wons the reservation
    let reservation = await this.prisma.reservation.findUnique({
      where: {
        id: data.id,
      },
    });
    if (reservation.userId != user['id']) {
      throw new ForbiddenException('You did not make the reservation.');
    }
    // things seem to be valid. delete the reservation.
    return await this.prisma.reservation.delete({
      where: {
        id: data.id,
      },
    });
  }

  async createReservation(user: any, data: ReservationDto) {
    // check if the client is a user
    if (!user.full_name) {
      throw new ForbiddenException('Hotels are not allowed to reserve a room.');
    }
    // fetch the room type to get the reservationLifetime
    const roomType = await this.prisma.roomType.findUnique({
      where: {
        id: data.roomTypeId,
      },
    });
    if (!roomType) {
      throw new NotFoundException('The room no longer is available.');
    }
    // calculate the expiry time
    const expiryTime = new Date();
    expiryTime.setMinutes(
      expiryTime.getMinutes() + roomType.reservationLifetime,
    );

    // and make a new reservation
    return await this.prisma.reservation.create({
      data: {
        startTime: new Date(),
        lifetime: roomType.reservationLifetime,
        expiryTime: expiryTime,
        occupancy: false,
        occupancyLifetime: null,
        userId: user.id,
        roomTypeId: data.roomTypeId,
        hotelId: roomType.hotelId,
      },
    });
  }

  async getRoomDataForHotel(hotelId: number) {
    let roomTypes = await this.prisma.roomType.findMany({
      where: {
        hotelId: hotelId,
      },
    });
    // now check if each room type is availabe and append a flag to say available or not
    for (let roomType of roomTypes) {
      let reservedAndOccupiedNumber = await this.prisma.reservation.count({
        where: {
          roomTypeId: roomType.id,
        },
      });
      if (roomType.totalNumber > reservedAndOccupiedNumber) {
        roomType['available'] = true;
      } else {
        roomType['available'] = false;
      }
    }
    return roomTypes;
  }
  async updateNumberOfRoomsOfRoomType(
    hotelId: any,
    roomType: { id: number; noOfRooms: number },
  ) {
    // make sure the hotel owns the roomType
    const roomTypeData = await this.prisma.roomType.findUnique({
      where: { id: roomType.id },
    });
    if (!roomTypeData) {
      throw new NotFoundException('room type not found');
    }
    if (roomTypeData.hotelId != hotelId) {
      throw new ForbiddenException('you do not own the room type');
    }
    return await this.prisma.roomType.update({
      where: { id: roomType.id },
      data: { totalNumber: roomType.noOfRooms },
    });
  }
  async deleteRoomType(hotelId: number, roomTypeId: number) {
    // make sure the hotel owns the roomType
    const roomType = await this.prisma.roomType.findUnique({
      where: { id: roomTypeId },
    });
    if (!roomType) {
      throw new NotFoundException('room type not found');
    }
    if (roomType.hotelId != hotelId) {
      throw new ForbiddenException('you do not own the room type');
    }
    // now delete the room type
    return await this.prisma.roomType.delete({
      where: { id: roomTypeId },
    });
  }

  async getHotelRoomTypes(hotel: Express.User) {
    return await this.prisma.roomType.findMany({
      where: { hotelId: hotel['id'] },
    });
  }

  async createHotelRoomType(dto: RoomTypeDto, hotel: Express.User) {
    return await this.prisma.roomType.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        reservationLifetime: dto.reservationLifetime,
        totalNumber: dto.totalNumber,
        hotelId: hotel['id'],
      },
    });
  }

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
    nearby.forEach((value) => {
      delete value.password_hash;
    });
    // return the top n
    return nearby.slice(0, n);
  }

  // a utility method to delete expired reservations and occupancies
  async updateDatabase() {
    // delete expired, non-promoted reservations and expired occupancies
    // remember! this works on the whole database.
    await this.prisma.reservation.deleteMany({
      where: {
        OR: [
          {
            occupancy: false,
            expiryTime: {
              lte: new Date(),
            },
          },
          {
            occupancy: true,
            occupancyExpiryTime: {
              lte: new Date(),
            },
          },
        ],
      },
    });
  }
}
