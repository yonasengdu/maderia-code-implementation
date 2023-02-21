import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Redirect, Render, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { CreatereviewDto, reviewDto, updateReviewDto } from './review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private reviewService:ReviewService){}

    @Get('getReview/:id')
    async getReviewsForHotel(@Param('id', new ParseIntPipe()) id) {
          return await this.reviewService.getReviewsForHotel(id)
    }

    @Get('getUserById/:id')
    async getUserById(@Param('id', new ParseIntPipe()) id){
        return await this.reviewService.getUserById(id)
    }


    @UseGuards(JwtGuard)
    @Post()
    @Redirect('http://localhost:3000/client/index',301)
    async createReview(@Body() dto: any, @Req() req: any) {
        return await this.reviewService.createReview(dto, req.user.id)
    }

    @Get('allhotels')
    async getAllHotels() {
    return  await this.reviewService.getAllHotels();
        }


    

    /**
     * get all reviews
     * @returns 
     */

    @UseGuards(JwtGuard)
    @Get()
    async getAllReviews(){
        return await this.reviewService.getAllReviews();
    }


    /**
     * 
     * @param id hotel id
     * @returns an array of reviews for a specific hotel
     */

    

    @UseGuards(JwtGuard)
    @Patch(':id')
    async updateReview(@Body() dto: updateReviewDto,@Param('id', new ParseIntPipe()) reviewId:number, @Req() req: any){
        return await this.reviewService.updateReview(dto,reviewId,req.user.id)
    }


    @UseGuards(JwtGuard)
    @Delete('/:id')
    async deleteReview(@Param('id', new ParseIntPipe()) reviewId:number, @Req() req: any){
        return await this.reviewService.deleteReview(reviewId,req.user.id)
    }
    @Get('average/:id')
    async getAverageRating(@Param('id', new ParseIntPipe()) hotelId:number){
        return await this.reviewService.getAverageRating(hotelId)
    }
    


}
