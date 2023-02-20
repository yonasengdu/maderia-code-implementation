import { All, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { reviewDto, updateReviewDto } from './review.dto'

@Injectable()
export class ReviewService {
    constructor(private prisma:PrismaService){}

    async createReview(dto: reviewDto, userId: number) {
        try {
            let hotel = await this.prisma.hotel.findUnique({
                where:{
                    id:dto.hotelId
                }
            })
            if (!hotel){
                throw  new NotFoundException(`Hotel  with ID ${dto.hotelId} not found.`);  
            }
            let newReview = await this.prisma.review.create({
                data: {
                    authorId: userId,
                    hotelId:dto.hotelId,
                    rating:dto.rating,
                    text:dto.text
                }
            });
            return {
                success:true,
                data:newReview
            }
        } catch (error) {
            if (error.code === "P2002") {
                return { success: false, message: "You have already reviewed this hotel." };
              }
              return { success: false, message: error.message };
            }
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

  async deleteReview(id: number, userId: number): Promise<reviewDto> {
    // Check if review with given id exists
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    // Check if the user is the author of the review
    if (review.authorId !== userId) {
      throw new ForbiddenException('You are not authorized to delete this review');
    }

    // Delete the review
    return this.prisma.review.delete({ where: { id } });
  }


  async getAverageRating(hotelId:number):Promise<number> {
    const reviews = await this.prisma.review.findMany({
      where: {
        hotelId: hotelId,
      },
      select: {
        rating: true,
      },
    });
    if (!reviews){
        return 0;
    }

    const numReviews = reviews.length;
    const sumRatings = reviews.reduce((acc, review) => acc + review.rating, 0);

    if (numReviews === 0) {
      return 0;
    } else {
      const averageRating = sumRatings / numReviews;
      await this.prisma.hotel.update({
        where: { id: hotelId },
        data: { averageRating: averageRating },
      });
      return averageRating;
    }
  }

  async getAllHotels(){
    return this.prisma.hotel.findMany()
  }
}


  







