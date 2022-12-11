import { Module } from '@nestjs/common';
import { SurfaceController } from './surface.controller';

@Module({
  controllers: [SurfaceController]
})
export class SurfaceModule {}
