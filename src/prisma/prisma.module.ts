import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * This is the PrismaModule that handles all logic related to talking with the database.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
