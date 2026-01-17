
export type SourceType = 'web' | 'libro' | 'articulo' | 'blog' | 'pdf';
export type ViewState = 'MENU' | 'APA_GENERATOR' | 'NOTES' | 'MOODBOARD' | 'PIPELINE' | 'LIBRARY' | 'TASKS' | 'PORTFOLIO' | 'SECRET' | 'SETTINGS' | 'EXPENSE_CONTROL' | 'AI_DETECTOR';

export interface CitationFormData {
  author: string;
  date: string;
  title: string;
  siteName: string;
  url: string;
  type: SourceType;
  groundingSources?: Array<{ title: string; url: string }>;
}

export interface MichiStats {
  name: string;
  pescaditos: number;
  happiness: number;
  energy: number;
  unlockedAccessories: string[];
  activeAccessory: string | null;
}

export interface UserConfig {
  nickname: string;
  avatar: string;
  greeting: string;
  greetingColor: string;
  themeColor: 'indigo' | 'pink' | 'emerald' | 'orange' | 'purple' | 'blue';
  fontStyle: 'modern' | 'academic' | 'playful' | 'mono' | 'retro';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  cardStyle: 'flat' | 'glass';
  bgOpacity: number;
  bgPattern: 'cats' | 'custom';
  customBg?: string;
  borderRadius: 'bento' | 'standard' | 'sharp';
  animationSpeed: 'smooth' | 'snappy';
  useGradients: boolean;
  privacyMode: boolean;
  michi: MichiStats;
}

export interface CitationProject {
  id: string;
  name: string;
  timestamp: number;
}

export interface Citation {
  id: string;
  projectId?: string;
  originalUrl: string;
  apaString: string;
  title: string;
  author: string;
  year: string;
  source: string;
  type: SourceType;
  timestamp: number;
  groundingSources?: Array<{ title: string; url: string }>;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  timestamp: number;
}

export type AchievementCategory = 'Proyecto' | 'Habilidad' | 'Logro' | 'Práctica' | 'Certificación';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  date: string;
  fileData?: string; 
  fileName?: string;
  fileMime?: string;
  timestamp: number;
}

export interface MoodboardItem {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  palette?: string[];
  timestamp: number;
}

export type LibraryCategory = 'Video' | 'Documento' | 'Libro' | 'Web' | 'Tutorial';

export interface LibraryFolder {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  timestamp: number;
}

export interface LibraryItem {
  id: string;
  folderId?: string | null;
  title: string;
  url?: string; 
  fileData?: string; 
  fileName?: string;
  fileMime?: string;
  category: LibraryCategory;
  note?: string;
  timestamp: number;
}

export type PipelineTemplate = 'Animación' | 'Ensayo Académico' | 'Proyecto de Ciencias' | 'Desarrollo de App';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface StageInfo {
  notes: string;
  links: string;
  technicalField1: string;
  technicalField2: string;
  checklist: ChecklistItem[];
  referenceImage?: string;
}

export interface PipelineProject {
  id: string;
  title: string;
  template: PipelineTemplate;
  description: string;
  objective: string;
  startDate: string;
  deadline: string;
  currentStage: string;
  stageData: Record<string, StageInfo>;
  timestamp: number;
}

export type TaskCategory = 'Tarea' | 'Examen' | 'Estudio' | 'Personal';
export type TaskPriority = 'Baja' | 'Media' | 'Alta';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  deadline?: string;
  completed: boolean;
  folderId?: string | null;
  timestamp: number;
}

export type ExpenseType = 'Entrada' | 'Salida';
export type ExpenseCategory = 'Comida' | 'Casa' | 'Escuela' | 'Ocio' | 'Varios';

export interface SavingGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: ExpenseType;
  category: ExpenseCategory;
  date: string;
  timestamp: number;
}

export interface ScheduleEntry {
  id: string;
  subject: string;
  task: string;
  color: string;
  timestamp: number;
}
