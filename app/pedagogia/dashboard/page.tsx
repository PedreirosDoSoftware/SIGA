"use client"

import { useEffect, useState } from "react"
import { Users, AlertTriangle, TrendingUp, UserX, UserCheck } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Aluno {
  id: string
  matricula: string
  nome: string
  turma: string
  nota1: number
  nota2: number
  nota3: number
  media: number
  status: string
  ativo: boolean
  faltas: number
}

export default function PedagogiaDashboard() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [turmas, setTurmas] = useState<any[]>([])

  useEffect(() => {
    const alunosData = localStorage.getItem("alunos")
    const turmasData = localStorage.getItem("turmas")

    if (alunosData) {
      const alunosComStatus = JSON.parse(alunosData).map((aluno: any) => ({
        ...aluno,
        ativo: aluno.ativo !== false, // Default para ativo se não especificado
        faltas: Math.floor(Math.random() * 10), // Simula faltas
      }))
      setAlunos(alunosComStatus)
    }

    if (turmasData) {
      setTurmas(JSON.parse(turmasData))
    }
  }, [])

  const alunosAtivos = alunos.filter((a) => a.ativo)
  const alunosInativos = alunos.filter((a) => !a.ativo)
  const alunosEmRisco = alunos.filter((a) => a.media < 6 || a.faltas > 5)
  const mediaGeral = alunos.length > 0 ? alunos.reduce((acc, aluno) => acc + aluno.media, 0) / alunos.length : 0

  const toggleAlunoStatus = (id: string) => {
    const updatedAlunos = alunos.map((aluno) => (aluno.id === id ? { ...aluno, ativo: !aluno.ativo } : aluno))
    setAlunos(updatedAlunos)
    localStorage.setItem("alunos", JSON.stringify(updatedAlunos))
  }

  return (
    <DashboardLayout userType="pedagogia">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Pedagógico</h1>
          <p className="text-gray-600">Gestão completa de alunos, notas e frequência</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total de Alunos" value={alunos.length} icon={Users} color="blue" />
          <StatsCard title="Alunos Ativos" value={alunosAtivos.length} icon={UserCheck} color="green" />
          <StatsCard title="Alunos em Risco" value={alunosEmRisco.length} icon={AlertTriangle} color="orange" />
          <StatsCard title="Média Geral" value={mediaGeral.toFixed(1)} icon={TrendingUp} color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alunos em Risco */}
          <Card>
            <CardHeader>
              <CardTitle>Alunos que Precisam de Atenção</CardTitle>
              <CardDescription>Estudantes com baixo desempenho ou muitas faltas</CardDescription>
            </CardHeader>
            <CardContent>
              {alunosEmRisco.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum aluno em situação de risco</p>
              ) : (
                <div className="space-y-4">
                  {alunosEmRisco.slice(0, 5).map((aluno) => (
                    <div key={aluno.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{aluno.nome}</p>
                        <p className="text-sm text-gray-600">
                          {aluno.turma} - Matrícula: {aluno.matricula}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-red-600">Média: {aluno.media.toFixed(1)}</span>
                          <span className="text-xs text-orange-600">Faltas: {aluno.faltas}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge variant="destructive">Risco</Badge>
                        <Button
                          size="sm"
                          variant={aluno.ativo ? "destructive" : "default"}
                          onClick={() => toggleAlunoStatus(aluno.id)}
                        >
                          {aluno.ativo ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas por Turma */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas por Turma</CardTitle>
              <CardDescription>Desempenho e quantidade de alunos por turma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {turmas.map((turma) => {
                  const alunosDaTurma = alunos.filter((a) => a.turma === turma.nome)
                  const mediaTurma =
                    alunosDaTurma.length > 0
                      ? alunosDaTurma.reduce((acc, a) => acc + a.media, 0) / alunosDaTurma.length
                      : 0
                  const alunosAtivosTurma = alunosDaTurma.filter((a) => a.ativo).length

                  return (
                    <div key={turma.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{turma.nome}</p>
                        <p className="text-sm text-gray-600">{turma.codigo}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {alunosAtivosTurma}/{alunosDaTurma.length} ativos
                        </p>
                        <p className="text-sm text-gray-600">Média: {mediaTurma.toFixed(1)}</p>
                        <Badge variant={mediaTurma >= 7 ? "default" : "secondary"}>
                          {mediaTurma >= 7 ? "Boa" : "Atenção"}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alunos Inativos */}
        {alunosInativos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Alunos Inativos</CardTitle>
              <CardDescription>Alunos que foram desativados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alunosInativos.map((aluno) => (
                  <div key={aluno.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-700">{aluno.nome}</p>
                      <p className="text-sm text-gray-500">
                        {aluno.turma} - Matrícula: {aluno.matricula}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Inativo</Badge>
                      <Button size="sm" variant="default" onClick={() => toggleAlunoStatus(aluno.id)}>
                        <UserCheck className="h-3 w-3 mr-1" />
                        Reativar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
