
import React, { useState, useMemo } from 'react';
import { Expense, ViewState, ExpenseCategory, ExpenseType, SavingGoal } from '../types';
import ExpenseItem from '../components/ExpenseItem';

interface ExpenseViewProps {
  setCurrentView: (view: ViewState) => void;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  privacyMode?: boolean; // Nueva prop
}

const CATEGORIES: ExpenseCategory[] = ['Comida', 'Casa', 'Escuela', 'Ocio', 'Varios'];
const CAT_COLORS: Record<ExpenseCategory, string> = {
  Comida: 'bg-orange-400',
  Casa: 'bg-blue-400',
  Escuela: 'bg-indigo-400',
  Ocio: 'bg-pink-400',
  Varios: 'bg-gray-400'
};

const ExpenseView: React.FC<ExpenseViewProps> = ({ setCurrentView, expenses, setExpenses, privacyMode = false }) => {
  const [navDate, setNavDate] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [goals, setGoals] = useState<SavingGoal[]>(() => {
    const saved = localStorage.getItem('saomihub_saving_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [newData, setNewData] = useState({ title: '', amount: '', type: 'Salida' as ExpenseType, category: 'Varios' as ExpenseCategory, date: new Date().toISOString().split('T')[0] });
  const [newGoal, setNewGoal] = useState({ title: '', target: '', current: '0', icon: '🎯', color: '#6366f1' });

  // Guardar metas en localStorage
  React.useEffect(() => {
    localStorage.setItem('saomihub_saving_goals', JSON.stringify(goals));
  }, [goals]);

  // Lógica de Quincena Mexicana
  const periodInfo = useMemo(() => {
    const month = navDate.getMonth();
    const year = navDate.getFullYear();
    const isFirstFortnight = navDate.getDate() <= 15;
    
    const startDay = isFirstFortnight ? 1 : 16;
    const lastDay = isFirstFortnight ? 15 : new Date(year, month + 1, 0).getDate();
    
    const monthName = navDate.toLocaleDateString('es-ES', { month: 'long' });
    
    return {
      month,
      year,
      isFirstFortnight,
      label: `${startDay} al ${lastDay} de ${monthName}`,
      shortLabel: `Q${isFirstFortnight ? 1 : 2} ${monthName.substring(0,3)}`,
      startDay,
      lastDay
    };
  }, [navDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.date + 'T00:00:00');
      const day = d.getDate();
      const inMonth = d.getMonth() === periodInfo.month && d.getFullYear() === periodInfo.year;
      const inFortnight = periodInfo.isFirstFortnight ? day <= 15 : day > 15;
      return inMonth && inFortnight;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, periodInfo]);

  const stats = useMemo(() => {
    const inc = filteredExpenses.filter(e => e.type === 'Entrada').reduce((a, b) => a + b.amount, 0);
    const out = filteredExpenses.filter(e => e.type === 'Salida').reduce((a, b) => a + b.amount, 0);
    
    // Calcular por categoría para el mini-gráfico
    const catTotals = CATEGORIES.map(cat => ({
      name: cat,
      total: filteredExpenses.filter(e => e.type === 'Salida' && e.category === cat).reduce((a, b) => a + b.amount, 0)
    }));

    return { inc, out, net: inc - out, catTotals };
  }, [filteredExpenses]);

  const changePeriod = (offset: number) => {
    const d = new Date(navDate);
    if (periodInfo.isFirstFortnight) {
      if (offset > 0) d.setDate(16);
      else { d.setMonth(d.getMonth() - 1); d.setDate(16); }
    } else {
      if (offset > 0) { d.setMonth(d.getMonth() + 1); d.setDate(1); }
      else d.setDate(1);
    }
    setNavDate(d);
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    const goal: SavingGoal = {
      id: crypto.randomUUID(),
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.target),
      currentAmount: parseFloat(newGoal.current),
      icon: newGoal.icon,
      color: newGoal.color
    };
    setGoals([...goals, goal]);
    setIsAddingGoal(false);
    setNewGoal({ title: '', target: '', current: '0', icon: '🎯', color: '#6366f1' });
  };

  const formatAmount = (num: number) => {
    if (privacyMode) return '••••••';
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="animate-slideUp space-y-8 pb-32">
      {/* Header & Nav */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <button onClick={() => setCurrentView('MENU')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">← Menú Principal</button>
        
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full border-2 border-gray-50 shadow-lg">
          <button onClick={() => changePeriod(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-400 text-lg transition-colors">❮</button>
          <div className="text-center min-w-[140px]">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">{periodInfo.label}</p>
            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter mt-1">Sincronizado con Quincena MX</p>
          </div>
          <button onClick={() => changePeriod(1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-400 text-lg transition-colors">❯</button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 flex flex-col justify-between h-32">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Ingresos Periodo</p>
          <p className={`text-3xl font-black ${privacyMode ? 'blur-sm select-none' : ''}`}>{formatAmount(stats.inc)}</p>
        </div>
        <div className="bg-red-500 p-6 rounded-[2.5rem] text-white shadow-xl shadow-red-100 flex flex-col justify-between h-32">
          <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Gastos Periodo</p>
          <p className={`text-3xl font-black ${privacyMode ? 'blur-sm select-none' : ''}`}>{formatAmount(stats.out)}</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-sm flex flex-col justify-between h-32">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Balance Neto</p>
          <p className={`text-3xl font-black ${stats.net >= 0 ? 'text-emerald-600' : 'text-red-600'} ${privacyMode ? 'blur-sm select-none' : ''}`}>
            {formatAmount(stats.net)}
          </p>
        </div>
      </div>

      {/* Categories Analysis */}
      <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-50 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Distribución de Gastos</h3>
          <span className={`text-[10px] font-bold text-gray-300 ${privacyMode ? 'blur-[3px]' : ''}`}>Total: {formatAmount(stats.out)}</span>
        </div>
        <div className="space-y-4">
          {stats.catTotals.map(cat => {
            const percentage = stats.out > 0 ? (cat.total / stats.out) * 100 : 0;
            return (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-wider">
                  <span className="text-gray-600">{cat.name}</span>
                  <span className={`text-gray-400 ${privacyMode ? 'blur-[3px]' : ''}`}>{formatAmount(cat.total)} ({Math.round(percentage)}%)</span>
                </div>
                <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <div 
                    className={`h-full ${CAT_COLORS[cat.name as ExpenseCategory]} transition-all duration-1000`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saving Goals */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Mis Metas de Ahorro</h3>
          <button onClick={() => setIsAddingGoal(true)} className="text-indigo-600 text-[9px] font-black uppercase tracking-widest hover:underline transition-all">+ Añadir Meta</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map(goal => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            return (
              <div key={goal.id} className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-sm group hover:border-indigo-100 transition-all relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-900 tracking-tight">{goal.title}</h4>
                      <p className={`text-[9px] font-bold text-gray-400 uppercase tracking-widest ${privacyMode ? 'blur-[2px]' : ''}`}>Faltan: {formatAmount(Math.max(goal.targetAmount - goal.currentAmount, 0))}</p>
                    </div>
                  </div>
                  <button onClick={() => setGoals(goals.filter(g => g.id !== goal.id))} className="text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1 transition-all">✕</button>
                </div>
                <div className="space-y-2">
                  <div className={`flex justify-between text-[9px] font-black text-gray-300 ${privacyMode ? 'blur-[2px]' : ''}`}>
                    <span>{formatAmount(goal.currentAmount)}</span>
                    <span>{formatAmount(goal.targetAmount)}</span>
                  </div>
                  <div className="h-2.5 bg-gray-50 rounded-full border border-gray-100 overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {goals.length === 0 && (
            <div className="md:col-span-2 py-10 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem]">
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No tienes metas activas</p>
            </div>
          )}
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4">Movimientos de la Quincena</h3>
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map(e => <ExpenseItem key={e.id} expense={e} privacyMode={privacyMode} onDelete={id => setExpenses(expenses.filter(exp => exp.id !== id))} />)
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sin movimientos en este periodo</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-3 z-50">
         <button onClick={() => setIsAdding(true)} className="w-16 h-16 bg-red-500 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl font-black hover:scale-110 active:scale-95 transition-transform">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
         </button>
      </div>

      {/* Modals omitted for brevity - same as original */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 bg-gray-900/60 backdrop-blur-sm overflow-y-auto pt-10">
          <div className="bg-white w-full max-w-md p-8 rounded-[3rem] shadow-2xl space-y-4 my-auto animate-slideUp">
            <h3 className="text-xl font-black text-red-600 uppercase text-center">Registro de Gasto</h3>
            <div className="space-y-4">
              <input type="text" placeholder="¿En qué gastaste?" value={newData.title} onChange={e => setNewData({...newData, title: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-red-100" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Monto $" value={newData.amount} onChange={e => setNewData({...newData, amount: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-black outline-none border-2 border-transparent focus:border-red-100" />
                <input type="date" value={newData.date} onChange={e => setNewData({...newData, date: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-xs outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={newData.type} onChange={e => setNewData({...newData, type: e.target.value as any})} className="p-4 bg-gray-50 rounded-2xl font-bold text-xs outline-none border-2 border-transparent focus:border-red-100">
                  <option value="Salida">Gasto / Salida</option><option value="Entrada">Ingreso / Entrada</option>
                </select>
                <select value={newData.category} onChange={e => setNewData({...newData, category: e.target.value as any})} className="p-4 bg-gray-50 rounded-2xl font-bold text-xs outline-none border-2 border-transparent focus:border-red-100">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase">Cancelar</button>
              <button onClick={() => { if(!newData.title || !newData.amount) return; setExpenses([{ id: crypto.randomUUID(), ...newData, amount: parseFloat(newData.amount), timestamp: Date.now() }, ...expenses]); setIsAdding(false); }} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-red-100">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {isAddingGoal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 bg-gray-900/60 backdrop-blur-sm overflow-y-auto pt-10">
          <div className="bg-white w-full max-w-sm p-8 rounded-[3rem] shadow-2xl space-y-4 my-auto animate-slideUp">
            <h3 className="text-xl font-black text-indigo-600 uppercase text-center">Nueva Meta</h3>
            <div className="space-y-4">
              <div className="flex justify-center text-4xl p-4 bg-indigo-50 rounded-3xl w-20 mx-auto border-2 border-indigo-100">{newGoal.icon}</div>
              <input type="text" placeholder="Ej. Nuevo Teclado" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Monto Meta $" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-black outline-none" />
                <input type="number" placeholder="Ya tengo $" value={newGoal.current} onChange={e => setNewGoal({...newGoal, current: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-black outline-none" />
              </div>
              <div className="flex justify-between gap-2 overflow-x-auto pb-2">
                {['🎯', '🎮', '📚', '🛫', '💻', '🧥', '🚲'].map(i => (
                  <button key={i} onClick={() => setNewGoal({...newGoal, icon: i})} className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-gray-50 border-2 ${newGoal.icon === i ? 'border-indigo-600' : 'border-transparent'}`}>{i}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setIsAddingGoal(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase">Cancelar</button>
              <button onClick={handleAddGoal} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase">Crear Meta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseView;
