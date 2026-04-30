import { Injectable } from '@nestjs/common';
import { RequiredFieldsRule } from './rules/required-fields.rule';
import { TotalsRule } from './rules/totals.rule';
import { LineItemsRule } from './rules/line-items.rule';
import { DatesRule } from './rules/dates.rule';
import { DuplicateRule } from './rules/duplicate.rule';
import { PrismaService } from '../../prisma/prisma.service';
import { ValidationResult } from './types/validation-result.type';
import { ValidationError } from './types/validation-error.type';
import { ExtractedDocument } from 'src/models/extracted-document.model';
import { DocumentStatus } from '@prisma/client';

@Injectable()
export class ValidationService {
    private rules;

    constructor(private prisma: PrismaService) {
        this.rules = [
            new RequiredFieldsRule(),
            new TotalsRule(),
            new LineItemsRule(),
            new DatesRule(),
            new DuplicateRule(this.prisma),
        ];
    }

    async validate(document: ExtractedDocument): Promise<ValidationResult> {
        const allErrors: ValidationError[] = [];

        for (const rule of this.rules) {
            const errors = await rule.validate(document);
            allErrors.push(...errors);
        }

        return {
            isValid: allErrors.length === 0,
            errors: allErrors,
        };
    }

    determineStatus(validation: ValidationResult): DocumentStatus {
        if (validation.isValid) return DocumentStatus.VALIDATED;
        if (validation.errors.length > 3) return DocumentStatus.REJECTED;
        return DocumentStatus.NEEDS_REVIEW;
    }
}