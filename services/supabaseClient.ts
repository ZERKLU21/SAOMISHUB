
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snzxachxoiginjbonzyv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuenhhY2h4b2lnaW5qYm9uenl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTc2OTUsImV4cCI6MjA3OTUzMzY5NX0.Nf3rtfpAkat9NCvZ-ddi0TH34hpy0ZtDCSMkZit1TL0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Nota sobre la base de datos:
 * Se asume que las tablas existen con una estructura similar a los tipos definidos en types.ts.
 * Tablas sugeridas: citations, notes, tasks, library_folders, library_items, achievements, expenses, pipelines, moodboard.
 */
