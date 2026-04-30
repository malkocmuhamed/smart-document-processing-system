import { ValidationRule } from './validation-rule.interface';
import { PrismaService } from '../../../prisma/prisma.service';
import { ExtractedDocument } from 'src/models/extracted-document.model';
import { ValidationError } from '../types/validation-error.type';

export class DuplicateRule implements ValidationRule {
    constructor(private prisma: PrismaService) { }

    async validate(document: ExtractedDocument): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];

        if (!document.documentNumber) return errors;

        const existing = await this.prisma.document.findFirst({
            where: {
                extractedData: {
                    path: ['documentNumber'],
                    equals: document.documentNumber,
                },
            },
        });

        if (existing) {
            errors.push({
                field: 'documentNumber',
                message: 'Duplicate document number',
            });
        }

        return errors;
    }
}