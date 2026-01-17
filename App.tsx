
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';
import MenuView from './views/MenuView';
import APAView from './views/APAView';
import NotesView from './views/NotesView';
import TasksView from './views/TasksView';
import LibraryView from './views/LibraryView';
import PortfolioView from './views/PortfolioView';
import MoodboardView from './views/MoodboardView';
import PipelineView from './views/PipelineView';
import ExpenseView from './views/ExpenseView';
import SettingsView from './views/SettingsView';
import SecretView from './views/SecretView';
import AIDetectorView from './views/AIDetectorView';
import MichiCompanion from './components/MichiCompanion';
import { supabase } from './services/supabaseClient';
import { 
  Citation, Note, MoodboardItem, PipelineProject, LibraryItem, LibraryFolder, UserConfig,
  Task, Achievement, ViewState, Expense, CitationProject, MichiStats
} from './types';

const CAT_PATTERN_URL = "https://img.freepik.com/free-vector/cute-cats-pattern-background-doodle-style_53876-100663.jpg?w=1380";

const DEFAULT_MICHI: MichiStats = {
  name: 'Michi',
  pescaditos: 0,
  happiness: 80,
  energy: 100,
  unlockedAccessories: [],
  activeAccessory: null
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isExitingSplash, setIsExitingSplash] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('MENU');
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'loading' | 'error'>('synced');
  
  const [userConfig, setUserConfig] = useState<UserConfig>({
    nickname: 'Saomi', avatar: '🐾', greeting: 'Hola,', greetingColor: '', themeColor: 'indigo', 
    fontStyle: 'modern', fontSize: 'base', cardStyle: 'flat', bgOpacity: 0.05, bgPattern: 'cats', 
    borderRadius: 'bento', animationSpeed: 'smooth', useGradients: true, customBg: '', privacyMode: false,
    michi: DEFAULT_MICHI
  });

  const [citations, setCitations] = useState<Citation[]>([]);
  const [citationProjects, setCitationProjects] = useState<CitationProject[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [moodboard, setMoodboard] = useState<MoodboardItem[]>([]);
  const [pipelines, setPipelines] = useState<PipelineProject[]>([]);
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [folders, setFolders] = useState<LibraryFolder[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const prevTasksRef = useRef<Task[]>([]);
  const isInitialLoad = useRef(true);

  // Carga inicial y Sincronización con Supabase
  useEffect(() => {
    const loadFromLocalStorage = () => {
      const load = (key: string, setter: any) => {
        const val = localStorage.getItem(key);
        if (val) setter(JSON.parse(val));
      };
      load('saomihub_citations', setCitations);
      load('saomihub_citation_projects', setCitationProjects);
      load('saomihub_notes', setNotes);
      load('saomihub_tasks', (t: Task[]) => {
        setTasks(t);
        prevTasksRef.current = t;
      });
      load('saomihub_moodboard', setMoodboard);
      load('saomihub_pipelines', setPipelines);
      load('saomihub_library', setLibrary);
      load('saomihub_library_folders', setFolders);
      load('saomihub_achievements', setAchievements);
      load('saomihub_user_config', (c: UserConfig) => setUserConfig(prev => ({...prev, ...c})));
      load('saomihub_expenses', setExpenses);
    };

    const loadFromSupabase = async () => {
      setSyncStatus('loading');
      try {
        // Ejemplo: Cargar citas de Supabase
        const { data: cloudCitations, error } = await supabase.from('citations').select('*').order('timestamp', { ascending: false });
        if (!error && cloudCitations && cloudCitations.length > 0) {
          setCitations(cloudCitations);
        }
        
        // Se podrían cargar el resto de las tablas aquí...
        
        setSyncStatus('synced');
      } catch (err) {
        console.error("Supabase load error:", err);
        setSyncStatus('error');
      }
    };

    loadFromLocalStorage();
    loadFromSupabase();

    // Iniciar transición de salida
    const exitTimer = setTimeout(() => {
      setIsExitingSplash(true);
      setTimeout(() => setShowSplash(false), 800);
    }, 3200);

    return () => clearTimeout(exitTimer);
  }, []);

  // Guardar en LocalStorage y Sincronizar con Supabase (Debounced/Auto-save)
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    localStorage.setItem('saomihub_citations', JSON.stringify(citations));
    localStorage.setItem('saomihub_citation_projects', JSON.stringify(citationProjects));
    localStorage.setItem('saomihub_notes', JSON.stringify(notes));
    localStorage.setItem('saomihub_tasks', JSON.stringify(tasks));
    localStorage.setItem('saomihub_moodboard', JSON.stringify(moodboard));
    localStorage.setItem('saomihub_pipelines', JSON.stringify(pipelines));
    localStorage.setItem('saomihub_library', JSON.stringify(library));
    localStorage.setItem('saomihub_library_folders', JSON.stringify(folders));
    localStorage.setItem('saomihub_achievements', JSON.stringify(achievements));
    localStorage.setItem('saomihub_user_config', JSON.stringify(userConfig));
    localStorage.setItem('saomihub_expenses', JSON.stringify(expenses));

    // Sincronización selectiva con Supabase para datos críticos (Citas/Links)
    const syncWithSupabase = async () => {
      try {
        // Upsert de citas (esto asume que la tabla 'citations' tiene RLS configurado o es pública para este anon key)
        if (citations.length > 0) {
          await supabase.from('citations').upsert(citations.map(c => ({
            id: c.id,
            original_url: c.originalUrl,
            apa_string: c.apaString,
            title: c.title,
            author: c.author,
            year: c.year,
            source: c.source,
            type: c.type,
            timestamp: c.timestamp,
            grounding_sources: c.groundingSources
          })));
        }
      } catch (e) {
        console.warn("Auto-sync background error:", e);
      }
    };

    const timer = setTimeout(syncWithSupabase, 2000);
    return () => clearTimeout(timer);
  }, [citations, citationProjects, notes, tasks, moodboard, pipelines, library, folders, achievements, userConfig, expenses]);

  // Detectar tareas completadas para dar pescaditos
  useEffect(() => {
    const newlyCompleted = tasks.filter(t => t.completed && !prevTasksRef.current.find(pt => pt.id === t.id)?.completed);
    if (newlyCompleted.length > 0) {
      setUserConfig(prev => ({
        ...prev,
        michi: {
          ...prev.michi,
          pescaditos: prev.michi.pescaditos + (newlyCompleted.length * 5),
          happiness: Math.min(prev.michi.happiness + (newlyCompleted.length * 2), 100),
          energy: Math.min(prev.michi.energy + (newlyCompleted.length * 1), 100)
        }
      }));
    }
    prevTasksRef.current = tasks;
  }, [tasks]);

  // Reducir energía y felicidad con el tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      setUserConfig(prev => ({
        ...prev,
        michi: {
          ...prev.michi,
          energy: Math.max(prev.michi.energy - 0.1, 0),
          happiness: Math.max(prev.michi.happiness - 0.05, 0)
        }
      }));
    }, 60000); 
    return () => clearInterval(interval);
  }, []);

  const handleTitleClick = () => {
    const nextCount = secretClickCount + 1;
    if (nextCount >= 5) {
      setSecretClickCount(0);
      setCurrentView('SECRET');
    } else {
      setSecretClickCount(nextCount);
      setTimeout(() => setSecretClickCount(0), 2000);
    }
  };

  const themeAccentColor = { indigo: 'indigo-600', pink: 'pink-500', emerald: 'emerald-500', orange: 'orange-500', purple: 'purple-500', blue: 'blue-500' }[userConfig.themeColor];
  const borderRadiusClass = { bento: 'rounded-[2.5rem]', standard: 'rounded-2xl', sharp: 'rounded-md' }[userConfig.borderRadius];
  const fontClassMap = { modern: 'font-sans', academic: 'font-times', playful: 'font-quicksand', mono: 'font-mono', retro: 'font-playfair' };
  const fontSizeClassMap = { sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl' };

  const renderView = () => {
    if (showSplash && !isExitingSplash) return null;

    switch (currentView) {
      case 'MENU':
        return <MenuView 
          setCurrentView={setCurrentView} 
          userConfig={userConfig} 
          themeAccentColor={themeAccentColor} 
          borderRadiusClass={borderRadiusClass} 
        />;
      case 'APA_GENERATOR':
        return <APAView 
          setCurrentView={setCurrentView} 
          citations={citations} 
          setCitations={setCitations} 
          citationProjects={citationProjects} 
          setCitationProjects={setCitationProjects} 
        />;
      case 'AI_DETECTOR':
        return <AIDetectorView setCurrentView={setCurrentView} />;
      case 'NOTES':
        return <NotesView 
          setCurrentView={setCurrentView} 
          notes={notes} 
          setNotes={setNotes} 
          library={library}
          setLibrary={setLibrary}
          folders={folders}
        />;
      case 'TASKS':
        return <TasksView 
          setCurrentView={setCurrentView} 
          tasks={tasks} 
          setTasks={setTasks} 
          folders={folders}
        />;
      case 'LIBRARY':
        return <LibraryView 
          setCurrentView={setCurrentView} 
          library={library} 
          setLibrary={setLibrary} 
          folders={folders} 
          setFolders={setFolders} 
        />;
      case 'PORTFOLIO':
        return <PortfolioView 
          setCurrentView={setCurrentView} 
          achievements={achievements} 
          setAchievements={setAchievements} 
        />;
      case 'MOODBOARD':
        return <MoodboardView 
          setCurrentView={setCurrentView} 
          moodboard={moodboard} 
          setMoodboard={setMoodboard} 
        />;
      case 'PIPELINE':
        return <PipelineView 
          setCurrentView={setCurrentView} 
          pipelines={pipelines} 
          setPipelines={setPipelines} 
        />;
      case 'EXPENSE_CONTROL':
        return <ExpenseView 
          setCurrentView={setCurrentView} 
          expenses={expenses} 
          setExpenses={setExpenses} 
          privacyMode={userConfig.privacyMode}
        />;
      case 'SETTINGS':
        return <SettingsView 
          setCurrentView={setCurrentView} 
          userConfig={userConfig} 
          setUserConfig={setUserConfig} 
        />;
      case 'SECRET':
        return <SecretView 
          setCurrentView={setCurrentView} 
          fontClass={fontClassMap[userConfig.fontStyle]} 
        />;
      default:
        return <MenuView setCurrentView={setCurrentView} userConfig={userConfig} themeAccentColor={themeAccentColor} borderRadiusClass={borderRadiusClass} />;
    }
  };

  const showHeader = currentView === 'MENU' && !showSplash;

  return (
    <div className={`min-h-screen flex flex-col relative bg-[#fcfcfd] overflow-x-hidden ${fontClassMap[userConfig.fontStyle]} ${fontSizeClassMap[userConfig.fontSize]}`}>
      {showSplash && <SplashScreen nickname={userConfig.nickname} themeColor={userConfig.themeColor} isExiting={isExitingSplash} />}
      
      <div 
        className={`fixed inset-0 pointer-events-none z-0 transition-all duration-700 ${showSplash ? 'opacity-0' : ''}`}
        style={{ 
          opacity: userConfig.bgOpacity, 
          backgroundImage: `url("${userConfig.bgPattern === 'cats' ? CAT_PATTERN_URL : userConfig.customBg || ''}")`, 
          backgroundSize: userConfig.bgPattern === 'cats' ? 'initial' : 'cover', 
          backgroundPosition: 'center',
          backgroundRepeat: userConfig.bgPattern === 'cats' ? 'repeat' : 'no-repeat'
        }} 
      />

      {showHeader && (
        <Header 
          onHomeClick={() => setCurrentView('MENU')}
          onTitleClick={handleTitleClick}
          nickname={userConfig.nickname} 
          avatar={userConfig.avatar} 
          themeColor={userConfig.themeColor}
          syncStatus={syncStatus}
        />
      )}

      <main className={`flex-1 max-w-4xl mx-auto w-full px-6 relative z-10 ${showHeader ? 'pt-24 pb-12' : showSplash ? '' : 'pt-8 pb-12'}`}>
        {renderView()}
      </main>

      {/* Compañero Michi-Estudiante */}
      {!showSplash && currentView !== 'SECRET' && (
        <MichiCompanion 
          tasks={tasks} 
          nickname={userConfig.nickname} 
          michi={userConfig.michi}
          onUpdateMichi={(stats) => setUserConfig(prev => ({ ...prev, michi: stats }))}
        />
      )}
    </div>
  );
};

export default App;
