import { Body, Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { Request } from 'express';
import { user } from '@prisma/client';

@Controller('client')
export class ClientController {

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
        client_type: 'user'
      }
    } else {
      return {
        name: client.hotel_name,
        client_type: 'hotel'
      }
    }
  }
}
