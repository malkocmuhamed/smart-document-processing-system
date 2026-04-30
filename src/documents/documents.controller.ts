import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Patch,
  UploadedFile,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) { }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const result = await this.documentsService.processDocument(file);

    return {
      message: 'File uploaded and saved to database',
      data: {
        id: result.id,
        fileName: result.fileName,
        status: result.status,
        extractedData: result.extractedData,
        validation: result.validationResult,
      }
    };
  }

  @Patch(':id')
  async updateDocument(
    @Param('id') id: string,
    @Body() updatedData: any,
  ) {
    return this.documentsService.updateDocument(id, updatedData);
  }

  @Get()
  async getAll() {
    return this.documentsService.getAll();
  }

  @Get('dashboard')
  async dashboard() {
    return this.documentsService.dashboard();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.documentsService.getOne(id);
  }
}