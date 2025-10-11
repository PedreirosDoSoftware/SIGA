import { supabase } from '../client'

export async function getUsuarios() {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getUsuarioById(id: string) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateUsuario(id: string, userData: { nome?: string; tipo?: string }) {
  const { data, error } = await supabase
    .from('usuarios')
    .update(userData)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}