import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Render, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { CreatereviewDto, reviewDto, updateReviewDto } from './review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private reviewService:ReviewService){}

    @UseGuards(JwtGuard)
    @Post()
    @Render('hotelDetails')
    async createReview(@Body() dto: any, @Req() req: any) {
        console.log(dto)
        return await this.reviewService.createReview(dto, req.user.id)
    }

    @Get('allhotels')
    async getAllHotels() {
    return  await this.reviewService.getAllHotels();
        }


    @Post(':id')
    async getReviewsForHotel(@Param('id', new ParseIntPipe()) id) {
          return this.reviewService.getReviewsForHotel(id)
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
