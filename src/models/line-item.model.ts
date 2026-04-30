export interface LineItem {
  description: string | null;
  quantity: number;
  price: number;
  total: number;
  originalTotal: number;
  isValid: boolean;
}