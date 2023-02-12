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
  price: number;
  @IsNotEmpty()
  @IsNumber()
  reservationLifetime: number;
  @IsNotEmpty()
  @IsNumber()
  totalNumber: number;
}