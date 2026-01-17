
import React from 'react';
import { Expense, ExpenseCategory } from '../types';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
  privacyMode?: boolean; // Nueva prop
}

const categoryIcons: Record<ExpenseCategory, string> = {
  Comida: '🍎',
  Casa: '🏠',
  Escuela: '✏️',
  Ocio: '🎮',
  Varios: '📦'
};

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete, privacyMode = false }) => {
  const isEntry = expense.type === 'Entrada';

  return (
    <div className={`bg-white p-5 rounded-[2.5rem] border-2 flex items-center justify-between shadow-sm group transition-all ${isEntry ? 'hover:border-emerald-100 border-gray-50' : 'hover:border-red-100 border-gray-50'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${isEntry ? 'bg-emerald-50' : 'bg-red-50'}`}>
          {categoryIcons[expense.category]}
        </div>
        <div>
          <h4 className="text-[13px] font-black uppercase tracking-tight text-gray-900 leading-tight">{expense.title}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[9px] font-black uppercase tracking-widest ${isEntry ? 'text-emerald-500' : 'text-red-400'}`}>
              {expense.type}
            </span>
            <span className="text-gray-200 text-[8px]">•</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{expense.date}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <span className={`text-sm md:text-base font-black transition-all ${isEntry ? 'text-emerald-600' : 'text-red-500'} ${privacyMode ? 'blur-md select-none group-hover:blur-none duration-500' : ''}`}>
          {isEntry ? '+' : '-'}${expense.amount.toFixed(2)}
        </span>
        <button 
          onClick={() => onDelete(expense.id)}
          className="p-2.5 text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-gray-50 rounded-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
