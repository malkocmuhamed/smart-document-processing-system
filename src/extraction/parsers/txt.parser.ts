import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ExtractedDocument } from 'src/models/extracted-document.model';

@Injectable()
export class TxtParser {
  parse(file: Express.Multer.File): ExtractedDocument {
    const content = fs.readFileSync(file.path, 'utf-8');

    const lines = content
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    let documentNumber: string | null = null;
    let total: number | null = null;
    let currency: string | null = null;

    for (const line of lines) {
      const lower = line.toLowerCase();

      // 🧠 Document number detection (multiple patterns)
      if (!documentNumber) {
        if (lower.includes('invoice')) {
          documentNumber = line.replace(/invoice/i, '').trim();
        } else if (lower.includes('inv')) {
          documentNumber = line.replace(/inv/i, '').trim();
        } else if (lower.includes('ref')) {
          documentNumber = line.replace(/ref[#:\s]*/i, '').trim();
        }
      }

      if (
        lower.includes('total') ||
        lower.includes('amount') ||
        lower.includes('due')
      ) {
        const numberMatch = line.match(/(\d+(\.\d+)?)/);
        if (numberMatch) {
          total = Number(numberMatch[0]);
        }

        const currencyMatch = line.match(/\b(EUR|USD|GBP)\b/i);
        if (currencyMatch) {
          currency = currencyMatch[0].toUpperCase();
        }
      }
    }

    return {
      documentType: 'INVOICE',
      documentNumber: documentNumber || null,
      total: total || null,
      currency: currency || null,
      supplier: null,
      subtotal: total || null,
      tax: null,
      lineItems: [],
    };
  }
}