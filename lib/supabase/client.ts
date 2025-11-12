import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Variáveis de ambiente que devem ser configuradas no .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Declara a variável com o tipo correto do SupabaseClient
// Usa "as any" como fallback para evitar quebras em ambientes sem config.
let supabase: SupabaseClient | any 

// Verifica se as variáveis existem
if (!supabaseUrl || !supabaseAnonKey) {
  // Em produção, exibe um aviso claro, mas evita quebra total no build.
  // Esta verificação com typeof window é para garantir que a mensagem só
  // apareça no browser (lado do cliente).
  if (typeof window !== 'undefined') {
    console.error('❌ Variáveis de ambiente do Supabase (URL ou KEY) não configuradas. O cliente Supabase não será inicializado corretamente.')
  }
  
  // Atribui um objeto vazio como fallback (como você fez) para evitar erros de referência nulos.
  // Componentes que usam 'supabase' devem lidar com a possibilidade de ele estar incompleto.
  supabase = {}
} else {
  // Cria cliente normal quando as chaves estão presentes
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }