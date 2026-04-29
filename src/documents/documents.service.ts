import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DocumentsService {
    constructor(private prisma: PrismaService) { }

    async createDocument(file: Express.Multer.File) {
        return this.prisma.document.create({
            data: {
                fileName: file.filename,
                originalName: file.originalname,
                fileType: file.mimetype,
                filePath: `/uploads/${file.filename}`,
                status: 'UPLOADED',
            },
        });
    }
}
