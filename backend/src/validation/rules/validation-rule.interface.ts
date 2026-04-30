import { ExtractedDocument } from "src/models/extracted-document.model";
import { ValidationError } from "../types/validation-error.type";

export interface ValidationRule {
    validate(document: ExtractedDocument): Promise<ValidationError[]>;
}