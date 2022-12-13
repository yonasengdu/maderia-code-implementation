import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { appendFile } from 'fs';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDto, HotelSignupDto, UserSignupDto } from '../src/auth/dto/auth.dto';
describe('app e2e',()=>{
    let app:INestApplication;
    let prisma:PrismaService;
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
        prisma = app.get(PrismaService);
        await app.listen(3000);
        // pactum.request.setBaseUrl(
        //     'http://localhost:3000',)
        await prisma.cleanDb();
        });
        afterAll(()=>{
            app.close()
        })
        describe('Auth', () => {
            const dto: UserSignupDto = {
                "full_name":"testname",
                "user_name":"testuser",
                "email":"test@gmail.com",
                "password":"testpassword"
            };
            describe('userSignup', () => {
              it('should throw if email empty', () => {
                return pactum
                  .spec()
                  .post('http://localhost:3000/auth/userSignup')
                  .withBody({
                    password: dto.password,
                  })
                  .expectStatus(400);
              });
              it('should throw if password empty', () => {
                return pactum
                  .spec()
                  .post('http://localhost:3000/auth/userSignup')
                  .withBody({
                    email: dto.email,
                  })
                  .expectStatus(400);
              });
              it('should throw if no body provided', () => {
                return pactum
                  .spec()
                  .post('http://localhost:3000/auth/userSignup')
                  .expectStatus(400);
              });
              it('should signup', () => {
                return pactum
                  .spec()
                  .post('http://localhost:3000/auth/userSignup')
                  .withBody(dto)
                  .expectStatus(201);
              });
            });
//_______________________________________________________________________________________
        
            describe('userSignin', () => {
              it('should throw if email empty', () => {
                return pactum
                  .spec()
                  .post('http://localhost:3000/auth/userSignin')
                  .withBody({
                    password: dto.password,
                  })
                  .expectStatus(400);
              });
              it('should throw if password empty', () => {
                return pactum
                  .spec()
                  .post('http://localhost:3000/auth/userSignin')
                  .withBody({
                    email: dto.email,
                  })
                  .expectStatus(400);
              });
              it('should throw if no body provided', () => {
                return pactum
                  .spec()
                  .post('http://localhost:3000/auth/userSignin')
                  .expectStatus(400);
              });
              it('should signin', () => {
                return pactum
                  .spec()
                  .post('http://localhost:3000/auth/userSignin')
                  .withBody(dto)
                  .expectStatus(200|201)
                  .stores('userAt', 'access_token'); //.store saves our token, so we can use it later.
              });
            });
//_____________________________________________________________--
            
//_______________________________________________________________
        describe('userUpdate',()=>{
            it('should update current user', () => {
                return pactum
                  .spec()
                  .post('http://localhost:3000/auth/userUpdate')
                  .withHeaders({
                    Authorization: 'Bearer $S{userAt}',
                  })
                  .withBody({    
                    "full_name":"testname",
                    "user_name":"testuser",
                    "email":"test@gmail.com",
                    "password":"testpassword"
                  })
                  .expectStatus(200|201);
              });
            });
//_____________________________________________________________________
        // describe('userPasswordReset',()=>{
        //     it('should update password of  current user', () => {
        //         return pactum
        //           .spec()
        //           .post('http://localhost:3000/auth/userPasswordReset')
        //           .withHeaders({
        //             Authorization: 'Bearer$ S{userAt}',
        //           })
        //           .withBody({
        //             "old_password":"testpassword",
        //             "new_password":"testpassword2"
        //           })
                  
        //           .expectStatus(200|201);
        //       });
        //     });
//___________________________________________
    describe('delete',()=>{
        it('should delete current user', () => {
            return pactum
              .spec()
              .delete('http://localhost:3000/auth/delete')
              .withHeaders({
                Authorization: 'Bearer $S{userAt}',
              })
                // now we are accessing our saved token
              .expectStatus(200);
          });
        });
//_____________________________________________


            })
//______________________________
describe('Auth hotel', () => {
    const dto: HotelSignupDto = {
        "hotel_name":"1samplehotel",
        "user_name":"samplehotelusername11",
        "email":"samplehote1l@gmail.com",
        "password":"samplehotelpassword1"
    };
    describe('hotelSignup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('http://localhost:3000/auth/hotelSignup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('http://localhost:3000/auth/hotelSignup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('http://localhost:3000/auth/hotelSignup')
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('http://localhost:3000/auth/hotelSignup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
//_______________________________________________________________________________________

    describe('hotelSignIn', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('http://localhost:3000/auth/hotelSignIn')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('http://localhost:3000/auth/hotelSignIn')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('http://localhost:3000/auth/hotelSignIn')
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('http://localhost:3000/auth/hotelSignIn')
          .withBody(dto)
          .expectStatus(200|201)
          .stores('userAt', 'access_token'); //.store saves our token, so we can use it later.
      });
    });
//_____________________________________________________________--
describe('delete',()=>{
    it('should delete current hotel', () => {
        return pactum
          .spec()
          .delete('http://localhost:3000/auth/hotel')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
//_______________________________________________________________
// describe('HotelUpdate',()=>{
//     it('should get current user', () => {
//         return pactum
//           .spec()
//           .post('http://localhost:3000/auth/hotelUpdate')
//           .withHeaders({
//             Authorization: 'Bearer $S{userAt}',
//           })
//           .withBody({    
//             "full_name":"Biniyam Samuel1",
//             "user_name":"bini1 s222",
//             "email":"Biniyam21@gmail223.com",
//             "password":"password112122"
//           })
//           .expectStatus(200);
//       });
//     });
//_____________________________________________________________________


          });
        });