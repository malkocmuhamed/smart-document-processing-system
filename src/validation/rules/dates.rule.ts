import { ExtractedDocument } from 'src/models/extracted-document.model';
import { ValidationRule } from './validation-rule.interface';
import { ValidationError } from '../types/validation-error.type';

export class DatesRule implements ValidationRule {
    async validate(document: ExtractedDocument): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];

        if (document.issueDate && isNaN(Date.parse(document.issueDate))) {
            errors.push({
                field: 'issueDate',
                message: 'Invalid issue date',
            });
        }

        if (document.dueDate && isNaN(Date.parse(document.dueDate))) {
            errors.push({
                field: 'dueDate',
                message: 'Invalid due date',
            });
        }

        return errors;
    }
}