import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { reviewDto } from './review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(private reviewService:ReviewService){}
    @UseGuards(JwtGuard)
    @Post()
    async createReview(@Body() dto: reviewDto, @Req() req: any) {
        return await this.reviewService.createReview(dto, req.user.id)
    }
}
