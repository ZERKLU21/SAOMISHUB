
import React, { useState, useMemo } from 'react';
import { Task, ViewState, LibraryFolder } from '../types';
import TaskItem from '../components/TaskItem';

interface TasksViewProps {
  setCurrentView: (view: ViewState) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  folders: LibraryFolder[];
}

type TaskFilter = 'all' | 'pending' | 'urgent' | 'completed';

const TasksView: React.FC<TasksViewProps> = ({ setCurrentView, tasks, setTasks, folders }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<TaskFilter>('pending');
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    category: 'Tarea' as any, 
    priority: 'Media' as any, 
    deadline: '',
    folderId: null as string | null
  });

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      if (filter === 'urgent') {
        if (!task.deadline || task.completed) return false;
        const deadlineDate = new Date(task.deadline + 'T23:59:59');
        const today = new Date();
        today.setHours(0,0,0,0);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 1;
      }
      return true;
    }).sort((a, b) => {
      // Priorizar por urgencia
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.timestamp - a.timestamp;
    });
  }, [tasks, filter]);

  const motivationalMessage = useMemo(() => {
    if (progress === 0) return "¡Empecemos con energía! 💪";
    if (progress < 50) return "Buen comienzo, ¡tú puedes! 🚀";
    if (progress < 100) return "¡Ya casi lo tienes! ✨";
    return "¡Día perfecto completado! 🏆";
  }, [progress]);

  return (
    <>
      <div className="animate-slideUp space-y-6 pb-20">
        <div className="flex justify-between items-center">
          <button onClick={() => setCurrentView('MENU')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600">← Menú Principal</button>
          <button onClick={() => { 
            setEditingTask(null); 
            setNewTask({ title: '', description: '', category: 'Tarea', priority: 'Media', deadline: '', folderId: null }); 
            setIsAdding(true); 
          }} className="bg-indigo-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-lg shadow-indigo-100/50">+ Nueva Tarea</button>
        </div>

        {/* Barra de Progreso (Mejora #1) */}
        <div className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-sm space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Progreso de hoy</p>
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{motivationalMessage}</h4>
            </div>
            <span className="text-xl font-black text-indigo-600">{progress}%</span>
          </div>
          <div className="h-3 bg-gray-50 rounded-full border-2 border-gray-100 overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(79,70,229,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Filtros (Mejora #2) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <FilterButton active={filter === 'pending'} onClick={() => setFilter('pending')} label="Pendientes" icon="⏳" />
          <FilterButton active={filter === 'urgent'} onClick={() => setFilter('urgent')} label="Urgentes" icon="⚡" />
          <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')} label="Completadas" icon="✅" />
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="Todas" icon="📁" />
        </div>

        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(t => (
              <TaskItem 
                key={t.id} 
                task={t} 
                folders={folders}
                onToggle={id => setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task))} 
                onDelete={id => setTasks(tasks.filter(task => task.id !== id))} 
                onEdit={task => { 
                  setEditingTask(task); 
                  setNewTask({ 
                    title: task.title, 
                    description: task.description || '', 
                    category: task.category, 
                    priority: task.priority, 
                    deadline: task.deadline || '',
                    folderId: task.folderId || null
                  }); 
                  setIsAdding(true); 
                }} 
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
              <span className="text-4xl mb-4 block">🎉</span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No hay tareas en esta lista</p>
            </div>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 bg-gray-900/60 backdrop-blur-sm overflow-y-auto pt-10">
          <div className="bg-white w-full max-w-md p-8 rounded-[3rem] shadow-2xl space-y-5 my-auto animate-slideUp">
            <h3 className="text-xl font-black text-indigo-600 uppercase text-center">{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Información Básica</p>
                <input type="text" placeholder="Título de la tarea" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-100 transition-all" />
                <textarea placeholder="Descripción o apuntes adicionales..." value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl h-24 text-sm outline-none border-2 border-transparent focus:border-indigo-100 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Categoría</p>
                  <select value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value as any})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-xs outline-none border-2 border-transparent focus:border-indigo-100">
                    <option value="Tarea">Tarea</option><option value="Examen">Examen</option><option value="Estudio">Estudio</option><option value="Personal">Personal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Fecha Límite</p>
                  <input type="date" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-xs outline-none border-2 border-transparent focus:border-indigo-100" />
                </div>
              </div>

              {/* Vinculación con Materias (Mejora #4) */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Vincular a Materia/Carpeta</p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setNewTask({...newTask, folderId: null})}
                    className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase transition-all border-2 ${!newTask.folderId ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-100'}`}
                  >
                    Ninguna
                  </button>
                  {folders.map(f => (
                    <button 
                      key={f.id}
                      onClick={() => setNewTask({...newTask, folderId: f.id})}
                      className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[9px] font-black uppercase transition-all border-2 ${newTask.folderId === f.id ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-gray-50 text-gray-400 border-transparent hover:border-gray-100'}`}
                    >
                      <span>{f.icon}</span>
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Prioridad</p>
                <div className="flex gap-2">
                  {['Baja', 'Media', 'Alta'].map(p => (
                    <button 
                      key={p} 
                      onClick={() => setNewTask({...newTask, priority: p as any})}
                      className={`flex-1 py-3 rounded-2xl font-black text-[9px] uppercase border-2 transition-all ${newTask.priority === p ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-gray-50 border-transparent text-gray-400'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase hover:bg-gray-200 transition-colors">Cancelar</button>
              <button 
                onClick={() => { 
                  if(!newTask.title.trim()) return; 
                  if(editingTask) setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...newTask } : t)); 
                  else setTasks([{ id: crypto.randomUUID(), ...newTask, completed: false, timestamp: Date.now() }, ...tasks]); 
                  setIsAdding(false); 
                }} 
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                {editingTask ? 'Actualizar' : 'Guardar Tarea'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const FilterButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: string }) => (
  <button 
    onClick={onClick}
    className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${active ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 border-gray-50 hover:border-indigo-100 hover:text-indigo-400'}`}
  >
    <span>{icon}</span>
    {label}
  </button>
);

export default TasksView;
