import { Global, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * The PrismaService class handles all the talk with the database. Not because there is any code in it.
 * It's because it inherits from PrismaClient.
 */
@Global()
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }
  cleanDb(){ return this.$transaction([
    this.user.deleteMany(),
    this.hotel.deleteMany()
  ]);

  }
}
