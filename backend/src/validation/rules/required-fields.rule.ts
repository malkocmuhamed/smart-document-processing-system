import { ValidationRule } from './validation-rule.interface';
import { ValidationError } from '../types/validation-error.type';
import { ValidationContext } from '../types/validation-context.type';

export class RequiredFieldsRule implements ValidationRule {
    async validate(ctx: ValidationContext): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];
        const document = ctx.document;

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