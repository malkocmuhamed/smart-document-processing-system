import { Injectable } from '@nestjs/common';
import { TxtParser } from './parsers/txt.parser';
import { CsvParser } from './parsers/csv.parser';
import { PdfParser } from './parsers/pdf.parser';
import { ImageParser } from './parsers/image.parser';

@Injectable()
export class ExtractionService {
  constructor(
    private txtParser: TxtParser,
    private csvParser: CsvParser,
    private pdfParser: PdfParser,
    private imageParser: ImageParser,
  ) { }

  async extract(file: Express.Multer.File) {
    const type = this.detectType(file);

    switch (type) {
      case 'txt':
        return this.txtParser.parse(file);

      case 'csv':
        return this.csvParser.parse(file);

      case 'pdf':
        return this.pdfParser.parse(file);

      case 'image':
        return this.imageParser.parse(file);
    }
  }

  private detectType(file: Express.Multer.File) {
    if (file.mimetype.includes('csv')) return 'csv';
    if (file.mimetype.includes('pdf')) return 'pdf';
    if (file.mimetype.includes('image')) return 'image';
    return 'txt';
  }
}