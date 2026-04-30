import { ExtractedDocument } from 'src/models/extracted-document.model';
import { ValidationRule } from './validation-rule.interface';
import { ValidationError } from '../types/validation-error.type';

export class RequiredFieldsRule implements ValidationRule {
    async validate(document: ExtractedDocument): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];

        if (!document.documentNumber) {
            errors.push({
                field: 'documentNumber',
                message: 'Document number is missing',
            });
        }

        if (!document.total) {
            errors.push({
                field: 'total',
                message: 'Total is missing',
            });
        }

        return errors;
    }
}