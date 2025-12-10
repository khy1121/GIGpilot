import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TaxConfig, Transaction } from '../types';
import { calculateTax } from '../services/taxService';
import { TrendingUp, TrendingDown, DollarSign, Globe } from 'lucide-react';

interface TaxDashboardProps {
  transactions: Transaction[];
  currentConfig: TaxConfig;
  onCountryChange: (code: 'US' | 'KR') => void;
}

const COLORS = ['#6366f1', '#e2e8f0']; // Indigo vs Slate

const TaxDashboard: React.FC<TaxDashboardProps> = ({ transactions, currentConfig, onCountryChange }) => {
  const taxData = useMemo(() => calculateTax(transactions, currentConfig), [transactions, currentConfig]);

  const pieData = [
    { name: '예상 세액', value: taxData.estimatedTax },
    { name: '세후 순수익', value: taxData.netProfit - taxData.estimatedTax },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(currentConfig.countryCode === 'US' ? 'en-US' : 'ko-KR', {
      style: 'currency',
      currency: currentConfig.currency
    }).format(val);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">실시간 세금 계산기</h2>
          <p className="text-sm text-slate-500">거래 내역에 따라 자동으로 견적이 업데이트됩니다</p>
        </div>
        <button 
          onClick={() => onCountryChange(currentConfig.countryCode === 'US' ? 'KR' : 'US')}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
        >
          <Globe className="w-4 h-4 text-slate-600" />
          {currentConfig.countryCode === 'US' ? '🇺🇸 미국 (US)' : '🇰🇷 대한민국 (KR)'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats Column */}
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">총 수입 (Gross Income)</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{formatCurrency(taxData.grossIncome)}</p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-2 text-red-700 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">지출 (Expenses)</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{formatCurrency(taxData.totalExpenses)}</p>
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
             <div className="flex items-center gap-2 text-indigo-700 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">예상 세액 (Est. Tax)</span>
            </div>
            <p className="text-2xl font-bold text-indigo-900">{formatCurrency(taxData.estimatedTax)}</p>
            <p className="text-xs text-indigo-600 mt-1">
              유효 세율: {(taxData.effectiveRate * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Chart Column */}
        <div className="h-48 relative">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-xs font-medium text-slate-400">순수익</span>
            <p className="text-sm font-bold text-slate-700">{formatCurrency(taxData.netProfit - taxData.estimatedTax)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxDashboard;