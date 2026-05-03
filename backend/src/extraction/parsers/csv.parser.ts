import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { ExtractedDocument } from 'src/models/extracted-document.model';

@Injectable()
export class CsvParser {
    parse(file: Express.Multer.File): ExtractedDocument {
        const content = fs.readFileSync(file.path, 'utf-8');

        const delimiter = content.includes('\t') ? '\t' : ',';

        const rows = content
            .split('\n')
            .map(r => r.trim())
            .filter(r => r.length > 0)
            .map(r => r.split(delimiter));

        if (rows.length < 2) {
            throw new Error('CSV has no data rows');
        }

        const headers = rows[0].map(h => h.trim().toLowerCase());

        const getIndex = (names: string[]) =>
            headers.findIndex(h => names.includes(h));

        const descIdx = getIndex(['desc', 'description', 'item']);
        const qtyIdx = getIndex(['qty', 'quantity']);
        const priceIdx = getIndex(['price', 'unitprice']);
        const totalIdx = getIndex(['total', 'line_total']);

        const dataRows = rows.slice(1);

        let subtotal = 0;
        const lineItems: any[] = [];

        for (const row of dataRows) {
            const desc = row[descIdx] || null;
            const qty = Number(row[qtyIdx]) || 0;
            const price = Number(row[priceIdx]) || 0;
            const totalFromFile = Number(row[totalIdx]) || 0;

            const calculatedTotal = qty * price;

            subtotal += totalFromFile;

            lineItems.push({
                description: desc,
                quantity: qty,
                price,
                total: totalFromFile,
                calculatedTotal,
            });
        }

        return {
            documentType: 'INVOICE',
            supplier: null,
            documentNumber: null,
            currency: null,
            issueDate: null,
            dueDate: null,
            subtotal,
            tax: null,
            total: subtotal,
            lineItems,
        };
    }
}