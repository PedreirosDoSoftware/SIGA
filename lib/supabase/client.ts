import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 1. Tipagem correta para o cliente
let supabase: SupabaseClient

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 2. "Falhar Rápido" (Fail Fast)
// Se as variáveis estiverem faltando, nós quebramos a aplicação IMEDIATAMENTE
// e dizemos ao desenvolvedor qual é o problema.
if (!supabaseUrl) {
  throw new Error('CONFIGURAÇÃO FALTANDO: NEXT_PUBLIC_SUPABASE_URL não foi definida no .env')
}
if (!supabaseAnonKey) {
  throw new Error('CONFIGURAÇÃO FALTANDO: NEXT_PUBLIC_SUPABASE_ANON_KEY não foi definida no .env')
}

// 3. Criar o cliente
// Agora temos certeza que as variáveis existem.
supabase = createClient(supabaseUrl, supabaseAnonKey)

export { supabase }