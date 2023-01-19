import { ForbiddenException, Injectable } from '@nestjs/common';
import { hotel, user } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {} 
}
