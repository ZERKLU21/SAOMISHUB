
import React from 'react';
import { ScheduleEntry } from '../types';

interface ScheduleItemProps {
  entry: ScheduleEntry;
  onDelete: (id: string) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ entry, onDelete }) => {
  return (
    <div className="flex gap-4 p-5 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all group relative">
      <div 
        className="w-1.5 rounded-full" 
        style={{ backgroundColor: entry.color }}
      ></div>
      
      <div className="flex-1 min-w-0 py-1">
        <h4 className="text-[14px] font-black text-gray-900 uppercase tracking-tight truncate mb-1">
          {entry.subject}
        </h4>
        <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
          {entry.task}
        </p>
      </div>

      <button 
        onClick={() => onDelete(entry.id)}
        className="self-start p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-gray-50 rounded-xl mt-1"
        title="Eliminar tarea"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ScheduleItem;
