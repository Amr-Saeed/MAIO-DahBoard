import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kqlcjtwmnrbexspxatiy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxbGNqdHdtbnJiZXhzcHhhdGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDE1MzQsImV4cCI6MjA4ODI3NzUzNH0.qRxfopCPgSongxRkga-KpTwVphZ0IIBtECOAu77XAUM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
