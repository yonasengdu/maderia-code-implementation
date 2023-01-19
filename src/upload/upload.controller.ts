import { Controller, ForbiddenException, Get, Param, Post, Res,Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {uuid} from 'uuidv4';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { hotel, user } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { JwtGuard } from 'src/auth/jwt.guard';



/**
 * this is an imageFileFilter middleware, this checks if the file is image or not an image
 * @param req 
 * @param file  uploaded file
 * @param callback 
 */
export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    //return callback(new Error('Only image files are allowed!'), false);
    throw new ForbiddenException('Only image files are allowed!')
    }
    callback(null, true);
  };

/**
 * this is editFileName middleware we are going to use it to change the file name.
 * @param req 
 * @param file 
 * @param callback 
 */
export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = uuid();
    callback(null, `${name}-${randomName}${fileExtName}`);
  };

/**
 * this is a route where users can send a from-data to our server
 * @example
 * localhost:3000/upload
 */
@Controller('upload')
export class UploadController {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    @Post()
    @UseGuards(JwtGuard)
    @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
     fileFilter: imageFileFilter,
    }),
  )
  async uploadedFile(@UploadedFile() file,@Request() req) {
    const user = req.user;
    const response = {
        filename: file.filename}
    if (user.full_name){

            return this.updateImage(user.id, file.filename);
        }
        else{
            return this.updateHotelImage(user.id,file.filename)

        }
  }
  /**
   * 
   * @param image 
   * @param res 
   * @returns returns image from a ./uploads folder
   */
  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
  return res.sendFile(image, { root: './uploads' });
}
async updateImage(userId: number, imagepath: string) {
    let user: user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if(!user) {
      // if there is no such user, it might be due to a deleted-user jwt or hotels making the request.
      // so throw an exception
      throw new ForbiddenException('No user found with the specified credentials')
    }
    
    user = await this.prisma.user.update({
      where: {id: userId},
      data: {
        image:imagepath
      }
    })
    delete user.password_hash
    return user
  } 
  async updateHotelImage(userId: number, imagepath: string) {
    let hotel: hotel = await this.prisma.hotel.findUnique({
      where: {
        id: userId
      }
    })
    if(!hotel) {
      // if there is no such user, it might be due to a deleted-user jwt or hotels making the request.
      // so throw an exception
      throw new ForbiddenException('No hotel found with the specified credentials')
    }
    
    hotel = await this.prisma.hotel.update({
      where: {id: userId},
      data: {
        hotel_image:imagepath
      }
    })
    delete hotel.password_hash
    return hotel
  } 
}
