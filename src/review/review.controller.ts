import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { reviewDto, updateReviewDto } from './review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private reviewService:ReviewService){}
    @UseGuards(JwtGuard)
    @Post()
    async createReview(@Body() dto: reviewDto, @Req() req: any) {
        return await this.reviewService.createReview(dto, req.user.id)
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

    @Get(':id')
    async getReviewsForHotel(@Param('id', new ParseIntPipe()) id) {
      return this.reviewService.getReviewsForHotel(id)
    }

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
    //this is controller is added just for testing only. and it is not supposed to be here so it should be in hotels controller.
    // it's name should be corrected also.
    @Put('a')
    async getAllHotels(){
        return await this.reviewService.getAllHotels()
    }



}
