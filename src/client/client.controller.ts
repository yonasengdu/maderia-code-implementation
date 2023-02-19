import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Render, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { Request } from 'express';
import { user } from '@prisma/client';
import { ClientService } from './client.service';
import { RoomTypeDto, UpdateNoOfRoomsDto, SingleIdDto, ReservationDto, UpdateReservationDto } from './dto.client';
import { AuthGuard } from '@nestjs/passport';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  // AuthGuard is a pre-made guard. we tell what type of guard we want by passing 'jwt'
  @UseGuards(JwtGuard)
  @Render('index')
  @Get('index')
  index(@Req() req: any) {
    // beware! what we get from inside the request can be a user or a hotel. by convention, it's appended as a 'user' in the request.
    const client = req.user;
    // this is how we know if the client we get as the 'request.body' is a user or a hotel. we check if
    // it contains a 'full_name' field only users have that field currently.
    if (client.full_name) {
      return {
        name: client.full_name,
        client_type: 'user',
        user: true,
      }
    } else {
      return {
        name: client.hotel_name,
        client_type: 'hotel'
      }
    }
  }

  @Get('nearbyHotels')
  @Render('nearby_hotels')
  nearbyHotels(){
    return {}
  }

  @Post('nearbyData')
  async nearbyData(@Body() body) {
    // get the nearby hotels from the database
    // we assume the front end code injects the location data in the body of the request
    let nearbyHotels = await this.clientService.nearbyHotels(body.location, 10)
    return {
      nearbyHotels,
    }
  }

  @UseGuards(JwtGuard)
  @Render('hotelManagement')
  @Post('hotelRoomTypes')
  async hotelRoomTypes(@Req() req: Request, @Body() dto: RoomTypeDto) {
    if(req.user["full_name"]) {
      // if the user is not a hotel, we throw an error
      throw new ForbiddenException("users can not create a room type")
    }
    return await this.clientService.createHotelRoomType(dto, req.user)
  }

  @UseGuards(JwtGuard)
  @Get('hotelRoomTypes')
  async getHotelRoomTypes(@Req() req: Request){
    if(req.user['full_name']) {
      // if the user is not a hotel, we throw an error
      throw new ForbiddenException("users do not have room types")
    }
    return await this.clientService.getHotelRoomTypes(req.user)
  }

  @UseGuards(JwtGuard)
  @Delete('hotelRoomTypes')
  async deleteRoomType(@Req() req: Request, @Body() data: SingleIdDto) {
    if(req.user['full_name']) {
      // if the user is not a hotel, we throw an error
      throw new ForbiddenException("users can not delete room types")
    }
    return await this.clientService.deleteRoomType(req.user['id'], data.id)
  }

  @UseGuards(JwtGuard)
  @Patch('hotelRoomTypes')
  async updateNumberOfRoomsOfRoomType(@Req() req: Request, @Body() data: UpdateNoOfRoomsDto) {
    if(req.user['full_name']) {
      // if the user is not a hotel, we throw an error
      throw new ForbiddenException("users can not update room types")
    }
    return this.clientService.updateNumberOfRoomsOfRoomType(req.user['id'], data)
  }

  @UseGuards(JwtGuard)
  @Render('hotelManagement')
  @Get('roomManagement')
  roomManagement() {
    return {}
  }

  @UseGuards(JwtGuard)
  @Render('hotelDetails')
  @Get('hotelDetail/:hotelId')
  hotelDetail(@Param('hotelId', new ParseIntPipe()) hotelId: number) {
    return {hotelId: hotelId}
  }

  @UseGuards(JwtGuard)
  @Get('hotelRoomData')
  async hotelRoomData(@Body() data: SingleIdDto) {
    return await this.clientService.getRoomDataForHotel(data.id)
  }

  @UseGuards(JwtGuard)
  @Post("reservation")
  async createReservation(@Req() req:Request, @Body() data: ReservationDto){
    return await this.clientService.createReservation(req.user, data);
  }

  @UseGuards(JwtGuard)
  @Delete('myReservations')
  async deleteReservation(@Req() req: Request, @Body() data: SingleIdDto){
    return await this.clientService.deleteUserReservation(req.user, data);
  }

  // let users see the reservations they made
  @UseGuards(JwtGuard)
  @Get('myReservations')
  async getUserReservations(@Req() req: Request) {
    return await this.clientService.getUserReservations(req.user);
  }

  @UseGuards(JwtGuard)
  @Get('reservationManagement')
  async getHotelReservationsAndOccupancies(@Req() req: Request) {
    return await this.clientService.getHotelReservationsAndOccupancies(req.user);
  }

  @UseGuards(JwtGuard)
  @Patch('reservation')
  async promoteReservationToOccupancy(@Req() req: Request, @Body() data: UpdateReservationDto) {
    return await this.clientService.promoteReservationToOccupancy(req.user, data);
  }
}
