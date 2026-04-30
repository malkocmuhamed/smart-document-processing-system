import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { ExtractionModule } from '../extraction/extraction.module';
import { ValidationModule } from 'src/validation/validation.module';

@Module({
  imports: [ExtractionModule, ValidationModule],
  controllers: [DocumentsController],
  providers: [DocumentsService]
})
export class DocumentsModule {}
