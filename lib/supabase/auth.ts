import { supabase } from './client'
import type { Usuario } from './types/database'

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

export async function signUp(email: string, password: string, userData: { nome: string; tipo: string }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })

  if (error) {
    console.error('Erro no cadastro:', error)
    throw error
  }

  // Criar registro na tabela usuarios
  if (data.user) {
    const { error: userError } = await supabase
      .from('usuarios')
      .insert([{
        id: data.user.id,
        email: data.user.email,
        nome: userData.nome,
        tipo: userData.tipo
      }])

    if (userError) {
      console.error('Erro ao criar usuário:', userError)
      throw userError
    }
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Erro no logout:', error)
    throw error
  }
}

export async function getCurrentUser(): Promise<Usuario | null> {
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

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}