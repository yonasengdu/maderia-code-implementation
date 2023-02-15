import { All, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { reviewDto, updateReviewDto } from './review.dto'

@Injectable()
export class ReviewService {
    constructor(private prisma:PrismaService){}

    async createReview(dto: reviewDto, userId: number) {
        let newReview = await this.prisma.review.create({
            data: {
                authorId: userId,
                hotelId:dto.hotelId,
                rating:dto.rating,
                text:dto.text
            }
        });
        return newReview
    }

    async getAllReviews(){
        let AllReviews = await this.prisma.review.findMany();
        return {
            "success":true,
            "data":AllReviews
        }
    }

    async getReviewsForHotel(hotelId:number){
        let Review = await this.prisma.review.findMany({
            where: {
                hotelId:hotelId,
            }
        });
        return Review;
    }

    async updateReview(dto:updateReviewDto,reviewId:number,userId:number){
        let updatedReview = await this.updateReviewByHotelId(dto,reviewId,userId)
        return updatedReview;
    }

    async updateReviewByHotelId(dto:updateReviewDto,reviewId:number,userId:number){
        const review = await this.prisma.review.findUnique({
            where:{
                id:reviewId
            }
            
        })
        if (!review){
            throw  new NotFoundException(`Review with ID ${reviewId} not found.`);
        }

        if (review.id != reviewId ){
            throw new UnauthorizedException(`you are not authorized to update this review`)
        }

        return this.prisma.review.update({
            where:{id:reviewId},
            data:dto
        })
        
    }

    
}

