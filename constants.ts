import { TaxConfig } from './types';

export const APP_NAME = "GigPilot";

// Simplified Tax Brackets for Demo Purposes
export const TAX_CONFIGS: Record<string, TaxConfig> = {
  US: {
    countryCode: 'US',
    currency: 'USD',
    standardDeduction: 12950,
    brackets: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11001, max: 44725, rate: 0.12 },
      { min: 44726, max: 95375, rate: 0.22 },
      { min: 95376, max: 182100, rate: 0.24 },
      { min: 182101, max: null, rate: 0.32 },
    ]
  },
  KR: {
    countryCode: 'KR',
    currency: 'KRW',
    standardDeduction: 1500000, // Simplified
    brackets: [
      { min: 0, max: 14000000, rate: 0.06 },
      { min: 14000001, max: 50000000, rate: 0.15 },
      { min: 50000001, max: 88000000, rate: 0.24 },
      { min: 88000001, max: null, rate: 0.35 },
    ]
  }
};

export const INITIAL_TRANSACTIONS = [
  { id: '1', date: '2023-10-01', client: 'Acme Corp', amount: 5000, type: 'INCOME', description: '웹 개발 프로젝트' },
  { id: '2', date: '2023-10-05', merchant: 'Apple Store', amount: 2000, type: 'EXPENSE', category: 'Equipment', description: '맥북 프로 구매' },
  { id: '3', date: '2023-10-10', merchant: 'Starbucks', amount: 15, type: 'EXPENSE', category: 'Meals', description: '클라이언트 미팅 (커피)' },
];