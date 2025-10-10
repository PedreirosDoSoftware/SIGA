import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://SEU_PROJETO.supabase.co";
const supabaseKey = "SUA_CHAVE_PUBLICA_DO_SUPABASE";

export const supabase = createClient(supabaseUrl, supabaseKey);
