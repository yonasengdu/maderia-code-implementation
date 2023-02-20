import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './app.filter';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    {cors: true}
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
    app.useGlobalFilters(new HttpExceptionFilter())
  app.use(cookieParser());  // this allows for storing into, and parsing a jwt from a cookie

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();