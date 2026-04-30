import { Module } from '@nestjs/common';
import { ExtractionService } from "./extraction.service";
import { CsvParser } from "./parsers/csv.parser";
import { ImageParser } from "./parsers/image.parser";
import { PdfParser } from "./parsers/pdf.parser";
import { TxtParser } from "./parsers/txt.parser";

@Module({
  providers: [
    ExtractionService,
    TxtParser,
    CsvParser,
    PdfParser,
    ImageParser,
  ],
  exports: [ExtractionService],
})
export class ExtractionModule { }