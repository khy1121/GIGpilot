import React, { useState } from 'react';
import { Invoice, InvoiceItem } from '../types';
import { FileText, Plus, Trash2, Send, Download } from 'lucide-react';

const InvoiceGenerator: React.FC = () => {
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '웹 개발 서비스', quantity: 10, rate: 85 }
  ]);
  const [clientName, setClientName] = useState('테크 솔루션 주식회사');
  
  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row h-full">
      {/* Editor Side */}
      <div className="p-6 md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200 overflow-y-auto max-h-[600px] no-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            새 청구서 작성
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">고객명 (Client Name)</label>
            <input 
              type="text" 
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
               <label className="block text-xs font-medium text-slate-500">청구 항목 (Line Items)</label>
               <button onClick={addItem} className="text-xs flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-800">
                 <Plus className="w-3 h-3" /> 항목 추가
               </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2 items-start bg-slate-50 p-2 rounded-lg group">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="항목 내용 (Description)"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full p-1.5 border border-slate-200 rounded text-sm mb-1"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="수량"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-16 p-1.5 border border-slate-200 rounded text-sm"
                      />
                      <input 
                        type="number" 
                        placeholder="단가"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-20 p-1.5 border border-slate-200 rounded text-sm"
                      />
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex justify-center items-center gap-2">
            <Send className="w-4 h-4" /> 이메일 전송
          </button>
          <button className="flex-1 border border-slate-300 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 flex justify-center items-center gap-2">
            <Download className="w-4 h-4" /> 다운로드
          </button>
        </div>
      </div>

      {/* Live Preview Side (Simulating PDF) */}
      <div className="md:w-1/2 bg-slate-100 p-6 overflow-y-auto max-h-[600px]">
        <div className="bg-white shadow-lg p-8 min-h-[500px] text-xs md:text-sm text-slate-800 mx-auto max-w-sm md:max-w-none transform md:scale-95 origin-top">
          <div className="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">INVOICE</h1>
              <p className="text-slate-500">#INV-{new Date().getFullYear()}-001</p>
            </div>
            <div className="text-right">
              <h4 className="font-bold text-slate-900">GigPilot User</h4>
              <p className="text-slate-500">freelancer@gigpilot.com</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">청구 대상 (Bill To):</p>
            <h3 className="text-lg font-bold text-slate-800">{clientName || '고객명'}</h3>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="pb-2 font-medium">내역</th>
                <th className="pb-2 text-right font-medium">수량</th>
                <th className="pb-2 text-right font-medium">단가</th>
                <th className="pb-2 text-right font-medium">금액</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-slate-50">
                  <td className="py-3">{item.description || '항목 내용'}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">${item.rate}</td>
                  <td className="py-3 text-right font-medium">${(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-1/2">
              <div className="flex justify-between py-2 border-t border-slate-900">
                <span className="font-bold text-lg">합계 (Total)</span>
                <span className="font-bold text-lg text-indigo-600">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;