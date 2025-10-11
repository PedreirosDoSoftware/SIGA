"use client"

import { useState, useEffect } from "react"
import { BookOpen, BarChart3, Calendar, Award } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/supabase/auth"
import { getAlunosByTurma } from "@/lib/supabase/database/alunos"

export default function AlunoDashboardPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [aluno, setAluno] = useState<any>(null)
  const [turmaAlunos, setTurmaAlunos] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const user = await getCurrentUser()
      setUsuario(user)

      // Buscar dados do aluno usando o email do usuário logado
const todosAlunos = await getAlunosByTurma('sua_turma_aqui') // ou busque todas as turmas
const alunoData = todosAlunos.find(a => a.email === user?.email) // ✅ Compara por email

setAluno(alunoData)

      // Carregar colegas de turma
      setTurmaAlunos(todosAlunos)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const getPosicaoTurma = () => {
    if (!aluno || turmaAlunos.length === 0) return 0
    
    const alunosOrdenados = [...turmaAlunos].sort((a, b) => b.media - a.media)
    return alunosOrdenados.findIndex(a => a.id === aluno.id) + 1
  }

  if (!aluno) {
    return (
      <DashboardLayout userType="aluno">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="aluno">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo de volta, {usuario?.nome}!</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Atual</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aluno.media.toFixed(1)}</div>
              <Badge 
                variant={
                  aluno.status === "Aprovado" ? "default" : 
                  aluno.status === "Recuperação" ? "secondary" : "destructive"
                }
                className="mt-2"
              >
                {aluno.status}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Turma</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aluno.turma}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {turmaAlunos.length} alunos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posição na Turma</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{getPosicaoTurma()}</div>
              <p className="text-xs text-muted-foreground mt-2">
                de {turmaAlunos.length} alunos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Aulas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-2">
                esta semana
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Notas Detalhadas */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Notas</CardTitle>
            <CardDescription>Desempenho acadêmico detalhado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-gray-600">Nota 1</div>
                <div className="text-2xl font-bold mt-2">{aluno.nota1.toFixed(1)}</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-gray-600">Nota 2</div>
                <div className="text-2xl font-bold mt-2">{aluno.nota2.toFixed(1)}</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-gray-600">Nota 3</div>
                <div className="text-2xl font-bold mt-2">{aluno.nota3.toFixed(1)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ranking da Turma */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking da Turma</CardTitle>
            <CardDescription>Desempenho dos colegas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {turmaAlunos
                .sort((a, b) => b.media - a.media)
                .slice(0, 5)
                .map((alunoRank, index) => (
                  <div 
                    key={alunoRank.id} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      alunoRank.id === aluno.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={alunoRank.id === aluno.id ? 'font-semibold text-blue-700' : ''}>
                        {alunoRank.nome}
                      </span>
                    </div>
                    <div className="font-semibold">{alunoRank.media.toFixed(1)}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}