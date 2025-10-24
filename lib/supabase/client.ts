import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Verificação para desenvolvimento
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis do Supabase não encontradas!')
  console.error('URL:', !!supabaseUrl)
  console.error('Chave:', !!supabaseAnonKey)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)