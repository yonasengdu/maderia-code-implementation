import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { Request } from 'express';
import { user } from '@prisma/client';

@Controller('client')
export class ClientController {
  // AuthGuard is a pre-made guard. we tell what type of guard we want by passing 'jwt'
  @UseGuards(JwtGuard)
  @Get('index')
  index(@Req() req: any) {
    // beware! what we get from inside the request can be a user or a hotel. by convention, it's appended as a 'user' in the request.
    const client = req.user;
    // this is how we know if the client we gor as the 'request.body' is a user or a hotel. we check if
    // it contains a 'full_name' field only users have that field currently.
    if (client.full_name) {
      return 'you are ' + req.user.user_name + '. You are logged in as a user.';
    } else {
      return 'You are ' + req.user.hotel_name + '. You are logged in as a hotel.';
    }
  }
}
