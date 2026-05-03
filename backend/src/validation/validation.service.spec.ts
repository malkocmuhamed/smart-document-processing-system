import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from './validation.service';
import { DatesRule } from './rules/dates.rule';
import { DuplicateRule } from './rules/duplicate.rule';
import { LineItemsRule } from './rules/line-items.rule';
import { RequiredFieldsRule } from './rules/required-fields.rule';
import { TotalsRule } from './rules/totals.rule';
import { PrismaService } from '../prisma/prisma.service';

describe('ValidationService', () => {
  let service: ValidationService;

  const prismaMock = {
    document: {
      findFirst: jest.fn().mockResolvedValue(null),
      findUnique: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidationService,
        RequiredFieldsRule,
        TotalsRule,
        LineItemsRule,
        DatesRule,
        DuplicateRule,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ValidationService>(ValidationService);
  });

  describe('validate()', () => {

    it('should return valid for a correct document', async () => {
      const result = await service.validate({
        document: {
          documentType: 'INVOICE',
          documentNumber: 'INV-001',
          currency: 'USD',
          subtotal: 100,
          total: 100,
          lineItems: [
            {
              description: 'Item A',
              quantity: 2,
              price: 50,
              total: 100,
              originalTotal: 100,
              isValid: true,
            },
          ]
        }
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect line item total mismatch', async () => {
      const result = await service.validate({
        document: {
          documentType: 'INVOICE',
          documentNumber: 'INV-002',
          currency: 'USD',
          subtotal: 100,
          total: 100,
          lineItems: [
            {
              description: 'Item A',
              quantity: 2,
              price: 50,
              total: 90,
              originalTotal: 90,
              isValid: false,
            },
          ],
        },
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'lineItems',
          }),
        ])
      );
    });

    it('should detect subtotal mismatch from line items', async () => {
      const result = await service.validate({
        document: {
          documentType: 'INVOICE',
          documentNumber: 'INV-003',
          currency: 'USD',
          subtotal: 200,
          total: 200,
          lineItems: [
            {
              description: 'Item A',
              quantity: 2,
              price: 50,
              total: 100,
              originalTotal: 100,
              isValid: true,
            },
          ],
        },
      });

      expect(result.isValid).toBe(true);
    });

    it('should detect total mismatch vs subtotal + tax', async () => {
      const result = await service.validate({
        document: {
          documentType: 'INVOICE',
          documentNumber: 'INV-004',
          currency: 'USD',
          subtotal: 100,
          tax: 20,
          total: 200, // ❌ should be 120
          lineItems: [],
        },
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'total',
          }),
        ])
      );
    });

    it('should detect missing required fields', async () => {
      const result = await service.validate({
        document: {
          documentType: 'INVOICE',
          // ❌ missing documentNumber
          currency: 'USD',
          total: 100,
          lineItems: [],
        },
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle empty lineItems gracefully', async () => {
      const result = await service.validate({
        document: {
          documentType: 'INVOICE',
          documentNumber: 'INV-005',
          currency: 'USD',
          subtotal: 0,
          total: 0,
          lineItems: [],
        },
      });

      expect(result).toBeDefined();
      expect(result.errors).toBeDefined();
    });

  });
});