export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export type DocumentStatus =
  | 'UPLOADED'
  | 'NEEDS_REVIEW'
  | 'VALIDATED'
  | 'REJECTED';

export interface Document {
  id: string;
  fileName: string;
  originalName?: string;
  fileType?: string;
  status: DocumentStatus;
  extractedData: any;
  validationResult: ValidationResult;
  createdAt: string;
}