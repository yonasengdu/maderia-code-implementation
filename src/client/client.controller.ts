import { Body, Controller, ForbiddenException, Get, Post, Render, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { Request } from 'express';
import { user } from '@prisma/client';
import { ClientService } from './client.service';
import { RoomTypeDto } from './dto.client';

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
  @Post('hotelRoomTypes')
  async hotelRoomTypes(@Req() req: Request, @Body() dto: RoomTypeDto) {
    if(req.user["full_name"]) {
      // if the user is not a hotel, we throw an error
      throw new ForbiddenException("users can not create a room type")
    }
    return await this.clientService.createHotelRoomType(dto, req.user)
  }
}
