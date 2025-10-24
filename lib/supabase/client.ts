import { createClient } from '@supabase/supabase-js'

// Verificação mais segura para produção
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any

// Verifica se as variáveis existem
if (!supabaseUrl || !supabaseAnonKey) {
  // Em produção, não quebra o build - só avisa
  if (typeof window !== 'undefined') {
    console.error('❌ Variáveis do Supabase não configuradas!')
  }
  
  // Cria cliente vazio para não quebrar o build
  supabase = {}
} else {
  // Cria cliente normal
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }