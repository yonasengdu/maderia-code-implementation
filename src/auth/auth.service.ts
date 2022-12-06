import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { HotelAuthDto, UserAuthDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
@Injectable()
export class AuthService{ 
    constructor(private prisma: PrismaService){}

    async userSignup(dto:UserAuthDto){
        //Generate password Hash for the user password
        const hash = await argon.hash(dto.password);
        // save the new user in db 
        try{
            const user = await this.prisma.user.create({
                data: {
                    full_name:dto.full_name,
                    user_name: dto.user_name,
                    password_hash:  hash.trim(),
                    email: dto.email,
                },
                select:{
                    full_name: true,
                    user_name:true,
                    password_hash:false,
                    email:true,
    
                }
            });
            
            return user
        } catch (error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException(`the ${error.meta.target} creadential has been taken`)
                }
            }
            throw error

        }

        //return the saved user 
    } 


    async hotelSignup(dto:HotelAuthDto){
         //Generate password Hash for the user password
         const hash = await argon.hash(dto.password)
        //  save the user(hotel) in db
         
        try {
                    const hotel = await this.prisma.hotel.create({
                        data: {
                            hotel_name: dto.hotel_name,
                            user_name: dto.user_name,
                            password_hash:  hash.trim(),
                            email: dto.email,
                        },
                        select:{
                            hotel_name:true,
                            user_name:true,
                            password_hash: false,
                            email: true,
                        }
                    });
                    return hotel
        }
        catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code === 'P2002'){
                    throw new ForbiddenException(`the ${error.meta.target} creadential has been taken`)
                }
            }
            throw error


        }
    }
}