import { ValidationContext } from "../types/validation-context.type";
import { ValidationError } from "../types/validation-error.type";

export interface ValidationRule {
validate(ctx: ValidationContext): Promise<ValidationError[]>;
}