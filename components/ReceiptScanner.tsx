import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { scanReceipt } from '../services/geminiService';
import { ExpenseCategory, Transaction, TransactionType } from '../types';

interface ReceiptScannerProps {
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onAddTransaction }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError(null);

    try {
      const base64 = await convertToBase64(file);
      // Remove data URL prefix for API
      const base64Data = base64.split(',')[1]; 
      
      const result = await scanReceipt(base64Data);

      const newTransaction: Omit<Transaction, 'id'> = {
        date: result.date || new Date().toISOString().split('T')[0],
        merchant: result.merchant,
        amount: result.total,
        type: TransactionType.EXPENSE,
        category: result.category as ExpenseCategory || ExpenseCategory.OTHER,
        description: `${result.merchant} 영수증 (${result.items?.length || 0}개 항목)`,
        receiptUrl: base64 // Store preview
      };

      onAddTransaction(newTransaction);
    } catch (err) {
      console.error(err);
      setError("영수증 처리에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Camera className="w-5 h-5 text-indigo-600" />
          AI 영수증 스캐너
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">
          Gemini 2.5 Flash
        </span>
      </div>

      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
           onClick={() => fileInputRef.current?.click()}>
        
        {isScanning ? (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
            <p className="text-sm text-slate-600 font-medium">데이터 추출 중...</p>
            <p className="text-xs text-slate-400 mt-1">상호명, 금액, 품목 분석 중</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-10 h-10 text-slate-400 mb-3" />
            <p className="text-sm text-slate-600 font-medium">영수증 업로드</p>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG 지원</p>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileUpload}
        />
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;