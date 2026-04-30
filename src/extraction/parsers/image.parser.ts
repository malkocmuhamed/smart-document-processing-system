import { Injectable } from '@nestjs/common';
import { ExtractedDocument } from 'src/models/extracted-document.model';

@Injectable()
export class ImageParser {
  parse(file: Express.Multer.File): ExtractedDocument {
    // OCR placeholder
    return {
      supplier: 'OCR_PENDING',
      documentNumber: 'OCR_PENDING',
      total: 0,
    };
  }
}