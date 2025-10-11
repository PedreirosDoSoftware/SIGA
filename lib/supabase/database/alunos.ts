import { supabase } from '../client'

export interface CreateAlunoData {
  matricula: string
  nome: string
  turma: string
  nota1: number
  nota2: number
  nota3: number
}

export async function getAlunos() {
  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getAlunoById(id: string) {
  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createAluno(alunoData: CreateAlunoData) {
  const media = (alunoData.nota1 + alunoData.nota2 + alunoData.nota3) / 3
  const status = media >= 7 ? 'Aprovado' : media >= 5 ? 'Recuperação' : 'Reprovado'

  const { data, error } = await supabase
    .from('alunos')
    .insert([{ ...alunoData, media, status }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateAluno(id: string, alunoData: Partial<CreateAlunoData>) {
  let updateData: any = { ...alunoData }
  
  // Recalcular média e status se notas foram alteradas
  if (alunoData.nota1 !== undefined || alunoData.nota2 !== undefined || alunoData.nota3 !== undefined) {
    const current = await getAlunoById(id)
    const nota1 = alunoData.nota1 ?? current.nota1
    const nota2 = alunoData.nota2 ?? current.nota2
    const nota3 = alunoData.nota3 ?? current.nota3
    const media = (nota1 + nota2 + nota3) / 3
    const status = media >= 7 ? 'Aprovado' : media >= 5 ? 'Recuperação' : 'Reprovado'
    updateData = { ...updateData, media, status }
  }

  const { data, error } = await supabase
    .from('alunos')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteAluno(id: string) {
  const { error } = await supabase
    .from('alunos')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getAlunosByTurma(turma: string) {
  const { data, error } = await supabase
    .from('alunos')
    .select('*')
    .eq('turma', turma)
    .order('nome')
  if (error) throw error
  return data
}