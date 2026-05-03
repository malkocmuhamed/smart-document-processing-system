import { Injectable } from '@nestjs/common';
import { TxtParser } from './parsers/txt.parser';
import { CsvParser } from './parsers/csv.parser';
import PdfParse from 'pdf-parse-new';

@Injectable()
export class ExtractionService {
  constructor(
    private txtParser: TxtParser,
    private csvParser: CsvParser,
  ) { }

  async extract(file: Express.Multer.File) {
    const type = this.detectType(file);

    switch (type) {
      case 'csv':
        return this.csvParser.parse(file);

      case 'txt':
        return this.txtParser.parse(file);

      case 'pdf': {
        try {
          const pdfText = await PdfParse(file.buffer);
          return this.txtParser.parseText(pdfText.text);
        } catch {
          return this.txtParser.parseText('');
        }
      }

      case 'image': {
        return this.txtParser.parseText('');
      }
    }
  }

  private detectType(file: Express.Multer.File) {
    if (file.mimetype.includes('csv')) return 'csv';
    if (file.mimetype.includes('pdf')) return 'pdf';
    if (file.mimetype.includes('image')) return 'image';
    return 'txt';
  }
}