import { LineItem } from "./line-item.model";

export interface ExtractedDocument {
  documentType?: 'INVOICE' | 'PO';
  supplier?: string | null;
  documentNumber?: string | null;
  issueDate?: string | null;
  dueDate?: string | null;
  currency?: string | null;
  lineItems?: LineItem[];
  subtotal?: number | null;
  tax?: number | null;
  total?: number | null;
}

