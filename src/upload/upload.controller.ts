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
    throw new ForbiddenException('Only image files are allowed!')
    }
    callback(null, true);
  };



/**this is editFileName middleware we are going to use it to change the file name.
 * By convention in node, the first argument to a callback is usually used to indicate an error. 
 * If it's something other than null, the operation was unsuccessful for some reason -- probably something that the callee cannot recover from but that the caller can recover from. 
 * Any other arguments after the first are used as return values from the operation (success messages, retrieval, etc.
 * 
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
    constructor(private uploadService: UploadService, private prisma: PrismaService, private jwt: JwtService) {}

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
  async uploadFile(@UploadedFile() file,@Request() req) {
    const user = req.user;
    const response = {
        filename: file.filename}
    if (user.full_name){

            return this.uploadService.updateImage(user.id, file.filename);
        }
        else{
            return this.uploadService.updateHotelImage(user.id,file.filename)

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
}
