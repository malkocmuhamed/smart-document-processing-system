import { Injectable } from '@nestjs/common';
import { ExtractedDocument } from 'src/models/extracted-document.model';

@Injectable()
export class PdfParser {
  parse(file: Express.Multer.File): ExtractedDocument {
    // OCR will be added later (bonus)
    return {
      supplier: 'OCR_PENDING',
      documentNumber: 'OCR_PENDING',
      total: 0,
    };
  }
}