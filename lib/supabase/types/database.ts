// lib/supabase/types/database.ts

export interface Usuario {
  id: string
  email: string
  nome: string
  tipo: 'admin' | 'professor' | 'aluno' | 'pedagogia'
  created_at: string
}

export interface Aluno {
  id: string
  matricula: string
  nome: string
  turma: string
  nota1: number
  nota2: number
  nota3: number
  media: number
  status: 'Aprovado' | 'Recuperação' | 'Reprovado'
  created_at: string
  user_id?: string
}

export interface Turma {
  id: string
  nome: string
  serie: string
  turno: string
  capacidade: number
  created_at: string
}