import { ValidationError } from '../types/validation-error.type';
import { ValidationRule } from './validation-rule.interface';
import { ValidationContext } from '../types/validation-context.type';


export class LineItemsRule implements ValidationRule {
    async validate(ctx: ValidationContext): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];
        const document = ctx.document;

        if (!document.lineItems || document.lineItems.length === 0) {
            return errors;
        }

        for (const item of document.lineItems) {
            if (
                item.quantity != null &&
                item.price != null &&
                item.total != null
            ) {
                const expected = item.quantity * item.price;

                if (item.price * item.quantity !== item.total) {
                    errors.push({
                        field: 'lineItems',
                        message: `Line total mismatch: expected ${item.price * item.quantity}, got ${item.total}`
                    });
                }
            }
        }

        return errors;
    }
}