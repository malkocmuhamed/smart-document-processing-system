import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class OcrService implements OnModuleInit, OnModuleDestroy {
  private worker: any;

  async onModuleInit() {
    const Tesseract = await import('tesseract.js');
    this.worker = await Tesseract.createWorker('eng');
  }

  async extractText(file: Express.Multer.File): Promise<string> {
    try {
      const { data } = await this.worker.recognize(file.buffer);
      return data.text || '';
    } catch (err) {
      console.error('OCR error:', err);
      return '';
    }
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.terminate();
    }
  }
}