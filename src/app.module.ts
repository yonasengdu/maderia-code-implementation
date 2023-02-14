import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { PrismaModule } from './prisma/prisma.module';
import { SurfaceModule } from './surface/surface.module';
import { UploadModule } from './upload/upload.module';
import { UploadService } from './upload/upload.service';
import { ReviewController } from './review/review.controller';
import { ReviewService } from './review/review.service';

/**
 * This is the main module of the nest app. It imports and uses other modules such as AuthModule,
 * ClientModule and PrismaModule
 */
@Module({
  imports: [AuthModule, ClientModule, PrismaModule, SurfaceModule, UploadModule],
  exports:[],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class AppModule {}
