import { ParseIntPipe, UsePipes } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RoomTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  price: number;
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  reservationLifetime: number;
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  totalNumber: number;
}

export class UpdateNoOfRoomsDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  id: number
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  noOfRooms: number
}


export class SingleIdDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  id: number
}

export class ReservationDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  roomTypeId: number
}

export class UpdateReservationDto {
  // this dto is explicitely only used to promote reservations into occupancies
  // it's highly discouraged to update any field on a reservation but 'occupancy',
  // 'occupancyLifetime', and 'occupancyExpiryTime'
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  reservationId: number
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  occupancyLifetime: number
}