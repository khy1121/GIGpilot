export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum ExpenseCategory {
  MEALS = 'Meals',
  TRAVEL = 'Travel',
  EQUIPMENT = 'Equipment',
  SOFTWARE = 'Software',
  OFFICE = 'Office',
  OTHER = 'Other',
}

export interface Transaction {
  id: string;
  date: string;
  merchant?: string; // For expenses
  client?: string;   // For income
  amount: number;
  type: TransactionType;
  category?: ExpenseCategory | string;
  description?: string;
  receiptUrl?: string; // Base64 or URL
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface TaxConfig {
  countryCode: 'KR' | 'US';
  currency: 'KRW' | 'USD';
  brackets: TaxBracket[];
  standardDeduction: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
}
