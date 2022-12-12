import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { appendFile } from 'fs';
import { AppModule } from '../src/app.module';
describe('app e2e',()=>{
    let app:INestApplication;
    beforeAll(async()=>{
        const moduleRef = await Test.createTestingModule({
            imports:[AppModule]
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
              whitelist: true,
            }),
          );   
        await app.init();
        });
        afterAll(()=>{
            app.close()
        })
        it.todo('should pass this ')
    })


// import {
//     INestApplication,
//     ValidationPipe,
//   } from '@nestjs/common';
  
//   import { Test } from '@nestjs/testing';
//   import * as pactum from 'pactum';
//   import { AppModule } from '../src/app.module';
//   //import { AuthDto } from '../src/auth/dto';
// //   import {
// //     CreateBookmarkDto,
// //     EditBookmarkDto,
// //   } from '../src/bookmark/dto';
//   import { PrismaService } from '../src/prisma/prisma.service';
//   //import { EditUserDto } from '../src/user/dto';
  
//   describe('App e2e', () => {
//     let app: INestApplication;
//     let prisma: PrismaService;
  
//     beforeAll(async () => {
//       const moduleRef =
//         await Test.createTestingModule({
//           imports: [AppModule],
//         }).compile();
  
//       app = moduleRef.createNestApplication();
//       app.useGlobalPipes(
//         new ValidationPipe({
//           whitelist: true,
//         }),
//       );
//       await app.init();
//       await app.listen(3333);
  
//       prisma = app.get(PrismaService);
//       //await prisma.cleanDb();
//       pactum.request.setBaseUrl(
//         'http://localhost:3333',
//       );
//     });
  
//     afterAll(() => {
//       app.close();
//     })
// });