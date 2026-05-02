import { ValidationRule } from './validation-rule.interface';
import { ValidationError } from '../types/validation-error.type';
import { ValidationContext } from '../types/validation-context.type';

export class TotalsRule implements ValidationRule {

    async validate(ctx: ValidationContext): Promise<ValidationError[]> {

        const errors: ValidationError[] = [];
        const document = ctx.document;

        const subtotal = Number(document.subtotal);
        const tax = Number(document.tax);
        const total = Number(document.total);

        if (!isNaN(subtotal) && !isNaN(tax) && !isNaN(total)) {

            const expected = subtotal + tax;

            const isValid = Math.abs(expected - total) < 0.01;

            if (!isValid) {
                errors.push({
                    field: 'total',
                    message: `Total mismatch (expected ${expected}, got ${total})`,
                });
            }
        }

        return errors;
    }
}