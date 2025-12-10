import React, { useState } from 'react';
import { Transaction, TaxConfig, ExpenseCategory } from './types';
import { TAX_CONFIGS, INITIAL_TRANSACTIONS } from './constants';
import TaxDashboard from './components/TaxDashboard';
import ReceiptScanner from './components/ReceiptScanner';
import InvoiceGenerator from './components/InvoiceGenerator';
import { LayoutDashboard, Receipt, FileText, Menu, X, PlusCircle } from 'lucide-react';

// Use Transaction type properly, allowing 'id' to be generated
type NewTransaction = Omit<Transaction, 'id'>;

const categoryMap: Record<string, string> = {
  [ExpenseCategory.MEALS]: '식대',
  [ExpenseCategory.TRAVEL]: '출장/교통',
  [ExpenseCategory.EQUIPMENT]: '장비',
  [ExpenseCategory.SOFTWARE]: '소프트웨어',
  [ExpenseCategory.OFFICE]: '사무실',
  [ExpenseCategory.OTHER]: '기타',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS as any);
  const [taxConfig, setTaxConfig] = useState<TaxConfig>(TAX_CONFIGS.US);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const addTransaction = (newTx: NewTransaction) => {
    const tx: Transaction = {
      ...newTx,
      id: Date.now().toString()
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id as any);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 fixed h-full z-10">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">GigPilot</h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          <NavItem id="dashboard" icon={LayoutDashboard} label="대시보드" />
          <NavItem id="invoices" icon={FileText} label="청구서 관리" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <img src="https://picsum.photos/100/100" className="w-10 h-10 rounded-full border border-slate-200" alt="Profile" />
            <div>
              <p className="text-sm font-semibold text-slate-700">김프리</p>
              <p className="text-xs text-slate-400">프로 플랜</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-20 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">GigPilot</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-10 pt-20 px-6">
          <nav className="space-y-4">
             <NavItem id="dashboard" icon={LayoutDashboard} label="대시보드" />
             <NavItem id="invoices" icon={FileText} label="청구서 관리" />
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Row: Tax Engine & Scanner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-full">
                <TaxDashboard 
                  transactions={transactions} 
                  currentConfig={taxConfig}
                  onCountryChange={(code) => setTaxConfig(TAX_CONFIGS[code])}
                />
              </div>
              <div className="lg:col-span-1">
                <ReceiptScanner onAddTransaction={addTransaction} />
              </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">최근 거래 내역</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">날짜</th>
                      <th className="px-4 py-3">내역</th>
                      <th className="px-4 py-3">유형</th>
                      <th className="px-4 py-3 text-right rounded-r-lg">금액</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">{tx.date}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {tx.merchant || tx.client || tx.description}
                          {tx.category && (
                            <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                              {categoryMap[tx.category] || tx.category}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${tx.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {tx.type === 'INCOME' ? '수입' : '지출'}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-slate-800'}`}>
                          {tx.type === 'EXPENSE' ? '-' : '+'}{new Intl.NumberFormat(taxConfig.countryCode === 'US' ? 'en-US' : 'ko-KR', { style: 'currency', currency: taxConfig.currency }).format(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="h-[calc(100vh-100px)]">
            <InvoiceGenerator />
          </div>
        )}
      </main>
    </div>
  );
}