import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExtractionService } from '../extraction/extraction.service';
import { ValidationService } from 'src/validation/validation.service';
import { DocumentStatus } from '@prisma/client';
import { ExtractedDocument } from 'src/models/extracted-document.model';

@Injectable()
export class DocumentsService {
    constructor(
        private prisma: PrismaService,
        private extractionService: ExtractionService,
        private validationService: ValidationService,
    ) { }

    async processDocument(file: Express.Multer.File) {
        const extracted = await this.extractionService.extract(file);
        const validation = await this.validationService.validate({
            document: extracted,
        });
        const status = this.validationService.determineStatus(validation);

        return this.prisma.document.create({
            data: {
                fileName: file.filename,
                originalName: file.originalname,
                fileType: file.mimetype,
                filePath: `/uploads/${file.filename}`,
                status,
                extractedData: extracted as Record<string, any>,
                validationResult: validation as Record<string, any>,
            },
        });
    }

    async updateDocument(id: string, extractedData: any) {
        const document: ExtractedDocument = {
            ...extractedData,
        };

        const validation = await this.validationService.validate({
            documentId: id,
            document,
        });
        const status = this.validationService.determineStatus(validation);

        return this.prisma.document.update({
            where: { id },
            data: {
                extractedData: extractedData as Record<string, any>,
                validationResult: validation as Record<string, any>,
                status,
            },
        });
    }

    async getAll() {
        return this.prisma.document.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async getOne(id: string) {
        const document = await this.prisma.document.findUnique({
            where: { id },
        });

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        return document;
    }

    async dashboard() {
        const docs = await this.prisma.document.findMany({
            orderBy: { createdAt: 'desc' },
        });
        const totalsByCurrency: Record<string, number> = {};

        for (const doc of docs) {
            const data: any = doc.extractedData;

            if (data?.currency && data?.total) {
                totalsByCurrency[data.currency] =
                    (totalsByCurrency[data.currency] || 0) + data.total;
            }
        }

        return {
            documents: docs,
            totalsByCurrency,
        };
    }
}