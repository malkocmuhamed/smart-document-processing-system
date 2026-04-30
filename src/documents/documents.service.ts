import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ExtractionService } from '../extraction/extraction.service';

@Injectable()
export class DocumentsService {
    constructor(private prisma: PrismaService, private extractionService: ExtractionService) { }

    async processDocument(file: Express.Multer.File) {
        const extracted = await this.extractionService.extract(file);

        return this.prisma.document.create({
            data: {
                fileName: file.filename,
                originalName: file.originalname,
                fileType: file.mimetype,
                filePath: `/uploads/${file.filename}`,
                status: 'UPLOADED',
                extractedData: extracted as any,
            },
        });
    }
}
