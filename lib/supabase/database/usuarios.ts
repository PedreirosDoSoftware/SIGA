import { supabase } from '../client'
import type { Usuario } from '../types/database'

export async function getUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar usuários:', error)
    throw error
  }

  return data || []
}

export async function getUsuarioById(id: string): Promise<Usuario | null> {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar usuário:', error)
    return null
  }

  return data
}

export async function updateUsuario(id: string, userData: {
  nome?: string
  tipo?: string
}): Promise<Usuario> {
  const { data, error } = await supabase
    .from('usuarios')
    .update(userData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar usuário:', error)
    throw error
  }

  return data
}