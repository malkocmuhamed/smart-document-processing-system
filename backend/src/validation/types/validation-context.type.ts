import { ExtractedDocument } from "src/models/extracted-document.model";

export interface ValidationContext {
  documentId?: string;
  document: ExtractedDocument;
}