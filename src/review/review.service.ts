import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { reviewDto } from './review.dto'

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
}

