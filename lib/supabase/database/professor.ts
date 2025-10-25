import { supabase } from '../client'

export interface Professor {
  id: string
  nome: string
  email: string
  disciplina: string
  user_id?: string
  created_at: string
}

export async function createProfessor(professorData: {
  nome: string
  email: string
  disciplina: string
  user_id?: string
}): Promise<Professor> {
  const { data, error } = await supabase
    .from('professores')
    .insert([professorData])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar professor:', error)
    throw error
  }

  return data
}

export async function getProfessores(): Promise<Professor[]> {
  const { data, error } = await supabase
    .from('professores')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar professores:', error)
    throw error
  }

  return data || []
}