import { createClient } from '@supabase/supabase-js';

const supabaseURL = process.env.NEXT_PUBLIC_PROJECT_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_PUBLIC_ANON_KEY as string;

export const supabase = createClient(supabaseURL, supabaseKey);
