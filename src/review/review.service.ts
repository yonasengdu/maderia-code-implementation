import { All, ForbiddenException, Injectable, NotFoundException, Render, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatereviewDto, reviewDto, updateReviewDto } from './review.dto'

@Injectable()
export class ReviewService {
    constructor(private prisma:PrismaService){}
    
    async createReview(dto: CreatereviewDto, userId: number) {
      let ID = Number(dto.id);
      let rate = Number(dto.rating);
      try {
          let hotel = await this.prisma.hotel.findUnique({
              where:{
                  id:Math.round(ID)
              }
          })
          if (!hotel){
              throw  new NotFoundException(`Hotel  with ID ${dto.id} not found.`);  
          }
          let newReview = await this.prisma.review.create({
              data: {
                  authorId: userId,
                  hotelId:Math.round(ID),
                  rating:Math.round(rate),
                  text:dto.text
              }
          });
  
          // Update the average rating for the hotel
          await this.getAverageRating(Math.round(ID));
  
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

    async getUserById(userId:number){
      let user = await this.prisma.user.findUnique({
        where:{
          id:userId
        }
      })
      return user;
    }

    async updateReview(dto:updateReviewDto,reviewId:number,userId:number){
      let updatedReview = await this.updateReviewByHotelId(dto,reviewId,userId)
  
      // Update the average rating for the hotel
      await this.getAverageRating(updatedReview.hotelId);
  
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
        data: { averageRating: Math.round(averageRating) },
      });
      return Math.round(averageRating);
    }
  }

  async getAllHotels(){
    return this.prisma.hotel.findMany()
  }
}


  







