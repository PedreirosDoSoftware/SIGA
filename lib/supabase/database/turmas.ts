import { supabase } from '../client'

export interface CreateTurmaData {
  nome: string
  serie: string
  turno: string
  capacidade: number
}

export async function getTurmas() {
  const { data, error } = await supabase
    .from('turmas')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createTurma(turmaData: CreateTurmaData) {
  const { data, error } = await supabase
    .from('turmas')
    .insert([turmaData])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTurma(id: string, turmaData: Partial<CreateTurmaData>) {
  const { data, error } = await supabase
    .from('turmas')
    .update(turmaData)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTurma(id: string) {
  const { error } = await supabase
    .from('turmas')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getTurmaWithAlunosCount(id: string) {
  const { data: turma, error } = await supabase
    .from('turmas')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error

  const { count } = await supabase
    .from('alunos')
    .select('*', { count: 'exact', head: true })
    .eq('turma', turma.nome)

  return { ...turma, alunos_count: count || 0 }
}