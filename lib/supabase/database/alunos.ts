import { supabase } from '../client'
import type { Aluno } from '../types/database'

export async function getAlunos(): Promise<Aluno[]> {
  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar alunos:', error)
    throw error
  }

  return data || []
}

export async function getAlunoById(id: string): Promise<Aluno | null> {
  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erro ao buscar aluno:', error)
    return null
  }

  return data
}

export async function getAlunoByUserId(userId: string): Promise<Aluno | null> {
  if (!userId) return null

  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Erro ao buscar aluno por user_id:', error)
    return null
  }

  return data
}

export async function getAlunosByTurma(turma: string): Promise<Aluno[]> {
  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .eq('turma', turma)
    .order('nome')

  if (error) {
    console.error('Erro ao buscar alunos por turma:', error)
    throw error
  }

  return data || []
}

// ✅ FUNÇÃO createAluno QUE ESTAVA FALTANDO - ADICIONE ESTA FUNÇÃO
export async function createAluno(alunoData: {
  matricula: string
  nome: string
  turma: string
  nota1: number
  nota2: number
  nota3: number
  user_id: string
}): Promise<Aluno> {
  const { data, error } = await supabase
    .from('alunos')
    .insert([{
      ...alunoData,
      media: 0,
      status: 'Cursando'
    }])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar aluno:', error)
    throw error
  }

  return data
}

export async function updateAluno(id: string, alunoData: Partial<{
  matricula: string
  nome: string
  turma: string
  nota1: number
  nota2: number
  nota3: number
}>): Promise<Aluno> {
  let updateData: any = { ...alunoData }
  
  // Recalcular média e status se notas foram alteradas
  if (alunoData.nota1 !== undefined || alunoData.nota2 !== undefined || alunoData.nota3 !== undefined) {
    const current = await getAlunoById(id)
    if (current) {
      const nota1 = alunoData.nota1 ?? current.nota1
      const nota2 = alunoData.nota2 ?? current.nota2
      const nota3 = alunoData.nota3 ?? current.nota3
      const media = (nota1 + nota2 + nota3) / 3
      const status = media >= 7 ? 'Aprovado' : media >= 5 ? 'Recuperação' : 'Reprovado'
      updateData = { ...updateData, media, status }
    }
  }

  const { data, error } = await supabase
    .from('alunos')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar aluno:', error)
    throw error
  }

  return data
}

export async function deleteAluno(id: string): Promise<void> {
  const { error } = await supabase
    .from('alunos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar aluno:', error)
    throw error
  }
}
