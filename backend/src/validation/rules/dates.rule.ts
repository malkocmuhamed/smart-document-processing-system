import { ValidationRule } from './validation-rule.interface';
import { ValidationError } from '../types/validation-error.type';
import { ValidationContext } from '../types/validation-context.type';

export class DatesRule implements ValidationRule {
    async validate(ctx: ValidationContext): Promise<ValidationError[]> {

        const errors: ValidationError[] = [];
        const document = ctx.document;

        if (!document) {
            return errors;
        }

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