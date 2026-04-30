import { ValidationError } from "./validation-error.type";

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}