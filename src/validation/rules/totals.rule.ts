import { ExtractedDocument } from 'src/models/extracted-document.model';
import { ValidationRule } from './validation-rule.interface';
import { ValidationError } from '../types/validation-error.type';


export class TotalsRule implements ValidationRule {
    async validate(document: ExtractedDocument): Promise<ValidationError[]> {
        const errors: ValidationError[] = [];

        if (
            document.subtotal != null &&
            document.tax != null &&
            document.total != null
        ) {
            const expected = document.subtotal + document.tax;

            if (expected !== document.total) {
                errors.push({
                    field: 'total',
                    message: `Total mismatch (expected ${expected}, got ${document.total})`,
                });
            }
        }

        return errors;
    }
}