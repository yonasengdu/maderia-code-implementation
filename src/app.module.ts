import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, ClientModule, PrismaModule],
})
export class AppModule {}
