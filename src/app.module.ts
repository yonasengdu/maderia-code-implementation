import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { PrismaModule } from './prisma/prisma.module';

/**
 * This is the main module of the nest app. It imports and uses other modules such as AuthModule,
 * ClientModule and PrismaModule
 */
@Module({
  imports: [AuthModule, ClientModule, PrismaModule],
})
export class AppModule {}
