import { TaxConfig, Transaction, TransactionType } from '../types';

export const calculateTax = (transactions: Transaction[], config: TaxConfig) => {
  const income = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = Math.max(0, income - expenses);
  const taxableIncome = Math.max(0, netProfit - config.standardDeduction);

  let totalTax = 0;
  let remainingIncome = taxableIncome;
  let previousMax = 0;

  for (const bracket of config.brackets) {
    if (remainingIncome <= 0) break;

    const range = bracket.max === null 
      ? remainingIncome 
      : bracket.max - previousMax;
    
    const taxableAmountInBracket = Math.min(remainingIncome, range);
    
    totalTax += taxableAmountInBracket * bracket.rate;
    remainingIncome -= taxableAmountInBracket;
    previousMax = bracket.max || Infinity;
  }

  return {
    grossIncome: income,
    totalExpenses: expenses,
    netProfit,
    taxableIncome,
    estimatedTax: totalTax,
    effectiveRate: income > 0 ? (totalTax / income) : 0
  };
};
