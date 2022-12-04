import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';



@Module({
  imports: [AuthModule, ClientModule],

})
export class AppModule {}
