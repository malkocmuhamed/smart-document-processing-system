import { ExtractedDocument } from 'src/models/extracted-document.model';
import { ValidationError } from '../types/validation-error.type';
import { ValidationRule } from './validation-rule.interface';


export class LineItemsRule implements ValidationRule {
    async validate(document: ExtractedDocument): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];

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

                if (expected !== item.total) {
                    errors.push({
                        field: 'lineItems',
                        message: `Line item incorrect (expected ${expected}, got ${item.total})`,
                    });
                }
            }
        }

        return errors;
    }
}