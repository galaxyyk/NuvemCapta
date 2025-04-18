import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xxx.supabase.co";
const supabaseAnonKey = "sua-chave-aqui";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
