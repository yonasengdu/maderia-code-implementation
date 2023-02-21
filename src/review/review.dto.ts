import { Transform } from "class-transformer"
import { IsNotEmpty } from "class-validator"

export class reviewDto{
    @IsNotEmpty()
    text : string
    @IsNotEmpty()
    @Transform(({ value }) => Number.parseInt(value))
    rating : number
    @IsNotEmpty()
    @Transform(({ value }) => Number.parseInt(value))
    hotelId: number
}

export class updateReviewDto{
    @IsNotEmpty()
    text:string
    @IsNotEmpty()
    rating:number
    @IsNotEmpty()
    hotelId:number
}


export class CreatereviewDto{
    @IsNotEmpty()
    text : string
    @IsNotEmpty()
    rating : string
    @IsNotEmpty()
    id: string
}
