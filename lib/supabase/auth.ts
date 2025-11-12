import { supabase } from './client'
// 'Usuario' não é importado neste ficheiro, mas sim em 'database.ts'
// Se precisar dele aqui, terá de ajustar o caminho de importação.
// import type { Usuario } from './types/database' 

// Login
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Erro no login:', error)
    throw error
  }

  return data
}

// Cadastro
export async function signUp(
  email: string,
  password: string,
  userData: { nome: string; tipo: string }
) {
  
  // --- ESTA É A VERSÃO CORRIGIDA ---
  // Nós confiamos no Trigger do SQL (handle_new_user)
  // para criar o perfil na tabela 'usuarios'.

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // ✅ CORREÇÃO: Altere 'data' para 'user_metadata'
      // O seu Trigger SQL 'handle_new_user' lê os dados daqui.
      data: userData
    }
  })

  if (error) {
    // O erro "Database error saving new user" virá daqui
    console.error('Erro no cadastro:', error)
    throw error
  }

  // Bloco de 'insert manual' removido (CORRETO).
  // O Trigger faz este trabalho.

  return data
}

// Logout
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Erro no logout:', error)
    throw error
  }
}

// Obter usuário atual da tabela 'usuarios'
// NOTA: Esta função não vai funcionar
// até que você importe 'Usuario' corretamente.
// O tipo 'Usuario' pode não ser necessário aqui.
export async function getCurrentUser(): Promise<any | null> { // Promise<Usuario | null>
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null

    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error) {
      console.error('Erro ao buscar usuário:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('Erro em getCurrentUser:', error)
    return null
  }
}

// Obter sessão atual
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Validação simples de email
export async function validationCont(email: string): Promise<boolean> {
  return email.includes('@')
}