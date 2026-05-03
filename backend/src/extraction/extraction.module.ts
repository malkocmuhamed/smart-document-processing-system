import { Module } from '@nestjs/common';
import { ExtractionService } from "./extraction.service";
import { CsvParser } from "./parsers/csv.parser";
import { TxtParser } from "./parsers/txt.parser";
import { OcrService } from './ocr.service';

@Module({
  providers: [
    ExtractionService,
    OcrService,
    TxtParser,
    CsvParser
  ],
  exports: [ExtractionService],
})
export class ExtractionModule { }