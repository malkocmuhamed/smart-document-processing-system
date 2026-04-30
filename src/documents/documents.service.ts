import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ExtractionService } from '../extraction/extraction.service';
import { ValidationService } from 'src/validation/validation.service';
import { DocumentStatus } from '@prisma/client';

@Injectable()
export class DocumentsService {
    constructor(
        private prisma: PrismaService,
        private extractionService: ExtractionService,
        private validationService: ValidationService,
    ) { }

    async processDocument(file: Express.Multer.File) {
        const extracted = await this.extractionService.extract(file);
        const validation = await this.validationService.validate(extracted);
        const status = this.validationService.determineStatus(validation);

        return this.prisma.document.create({
            data: {
                fileName: file.filename,
                originalName: file.originalname,
                fileType: file.mimetype,
                filePath: `/uploads/${file.filename}`,
                status,
                extractedData: extracted as any,
                validationResult: validation as any,
            },
        });
    }
}