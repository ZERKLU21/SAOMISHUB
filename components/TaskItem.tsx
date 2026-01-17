
import React from 'react';
import { Task, LibraryFolder } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  folders: LibraryFolder[];
}

const categoryColors: Record<string, string> = {
  Tarea: 'bg-blue-100 text-blue-600 border-blue-200',
  Examen: 'bg-red-100 text-red-600 border-red-200',
  Estudio: 'bg-purple-100 text-purple-600 border-purple-200',
  Personal: 'bg-green-100 text-green-600 border-green-200',
};

const priorityIcons: Record<string, string> = {
  Baja: '⚪',
  Media: '🟡',
  Alta: '🔴',
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit, folders }) => {
  const linkedFolder = folders.find(f => f.id === task.folderId);

  const isUrgent = React.useMemo(() => {
    if (!task.deadline || task.completed) return false;
    const deadlineDate = new Date(task.deadline + 'T23:59:59');
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1; // Hoy o mañana
  }, [task.deadline, task.completed]);

  const isOverdue = React.useMemo(() => {
    if (!task.deadline || task.completed) return false;
    const deadlineDate = new Date(task.deadline + 'T23:59:59');
    const now = new Date();
    return deadlineDate < now;
  }, [task.deadline, task.completed]);

  return (
    <div className={`flex flex-col gap-3 p-5 bg-white border-2 rounded-[2rem] transition-all relative overflow-hidden group ${task.completed ? 'opacity-60 grayscale-[0.2] border-transparent bg-gray-50/30 shadow-none' : 'hover:shadow-xl hover:-translate-y-0.5 border-gray-50'}`}>
      
      {isUrgent && !task.completed && (
        <div className="absolute top-0 right-0 p-2 z-10">
          <span className="animate-pulse bg-red-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
            {isOverdue ? 'Vencida 🚨' : '¡Urgente! ⚡'}
          </span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button 
          onClick={() => onToggle(task.id)}
          className={`w-10 h-10 rounded-2xl border-2 flex-shrink-0 flex items-center justify-center transition-all ${task.completed ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' : 'border-gray-100 hover:border-indigo-400 bg-gray-50'}`}
        >
          {task.completed && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <h4 className={`text-sm font-black uppercase tracking-tight truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {task.title}
            </h4>
            {linkedFolder && (
              <span 
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-tight"
                style={{ backgroundColor: linkedFolder.color + '20', borderColor: linkedFolder.color + '40', color: '#1f2937' }}
              >
                <span>{linkedFolder.icon}</span>
                {linkedFolder.name}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full border ${categoryColors[task.category]}`}>
              {task.category}
            </span>
            <span className="text-[10px] flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100" title={`Prioridad ${task.priority}`}>
              <span className="text-[12px]">{priorityIcons[task.priority]}</span>
              <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{task.priority}</span>
            </span>
            {task.deadline && (
              <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${isUrgent ? 'bg-red-50 text-red-500 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                📅 {task.deadline}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)}
            className="p-2 bg-gray-50 rounded-xl text-gray-300 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-indigo-50 transition-all shadow-sm"
            title="Editar tarea"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-2 bg-gray-50 rounded-xl text-gray-300 hover:text-red-500 hover:bg-white border border-transparent hover:border-red-50 transition-all shadow-sm"
            title="Eliminar tarea"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {task.description && (
        <div className="pl-14">
          <p className={`text-[11px] leading-relaxed ${task.completed ? 'text-gray-300' : 'text-gray-500'} font-medium line-clamp-2 group-hover:line-clamp-none transition-all`}>
            {task.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
