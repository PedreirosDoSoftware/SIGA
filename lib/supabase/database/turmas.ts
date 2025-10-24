import { supabase } from '../client'
import type { Turma } from '../types/database'

export async function getTurmas(): Promise<Turma[]> {
  const { data, error } = await supabase
    .from('turmas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar turmas:', error)
    throw error
  }

  return data || []
}

export async function getTurmaById(id: string): Promise<Turma | null> {
  const { data, error } = await supabase
    .from('turmas')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar turma:', error)
    return null
  }

  return data
}

export async function createTurma(turmaData: {
  nome: string
  serie: string
  turno: string
  capacidade: number
}): Promise<Turma> {
  const { data, error } = await supabase
    .from('turmas')
    .insert([turmaData])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar turma:', error)
    throw error
  }

  return data
}

export async function updateTurma(id: string, turmaData: Partial<{
  nome: string
  serie: string
  turno: string
  capacidade: number
}>): Promise<Turma> {
  const { data, error } = await supabase
    .from('turmas')
    .update(turmaData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar turma:', error)
    throw error
  }

  return data
}

export async function deleteTurma(id: string): Promise<void> {
  const { error } = await supabase
    .from('turmas')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar turma:', error)
    throw error
  }
}

export async function getTurmaWithAlunosCount(id: string) {
  const turma = await getTurmaById(id)
  if (!turma) return null

  const { count } = await supabase
    .from('alunos')
    .select('*', { count: 'exact', head: true })
    .eq('turma', turma.nome)

  return {
    ...turma,
    alunos_count: count || 0
  }
}