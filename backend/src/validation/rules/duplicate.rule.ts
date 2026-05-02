import { ValidationRule } from './validation-rule.interface';
import { ValidationError } from '../types/validation-error.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationContext } from '../types/validation-context.type';

export class DuplicateRule implements ValidationRule {
    constructor(private prisma: PrismaService) { }

    async validate(ctx: ValidationContext): Promise<ValidationError[]> {

        const errors: ValidationError[] = [];
        const document = ctx.document;
        const documentId = ctx.documentId;

        if (!document.documentNumber) return errors;

        const existing = await this.prisma.document.findFirst({
            where: {
                id: {
                    not: documentId, 
                },
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