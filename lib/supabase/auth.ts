import { supabase } from './client'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, userData: { nome: string; tipo: string }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: userData }
  })
  if (error) throw error

  if (data.user) {
    const { error: userError } = await supabase
      .from('usuarios')
      .insert([{
        id: data.user.id,
        email: data.user.email,
        nome: userData.nome,
        tipo: userData.tipo
      }])
    if (userError) throw userError
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data: user, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', session.user.id)
    .single
}