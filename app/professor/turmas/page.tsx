"use client"

import { useEffect, useState } from "react"
import { BookOpen, Users, TrendingUp } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ProfessorTurmasPage() {
  const [turmas, setTurmas] = useState<any[]>([])
  const [alunos, setAlunos] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("usuario")
    const turmasData = localStorage.getItem("turmas")
    const alunosData = localStorage.getItem("alunos")

    if (userData) {
      setUsuario(JSON.parse(userData))
    }

    if (turmasData) {
      setTurmas(JSON.parse(turmasData))
    }

    if (alunosData) {
      setAlunos(JSON.parse(alunosData))
    }
  }, [])

  // Filtra turmas do professor logado
  const minhasTurmas = turmas.filter((turma) =>
    turma.professor.toLowerCase().includes(usuario?.nome?.toLowerCase() || ""),
  )

  const totalAlunos = alunos.filter((aluno) => minhasTurmas.some((turma) => turma.nome === aluno.turma)).length

  const mediaGeralTurmas =
    minhasTurmas.length > 0
      ? minhasTurmas.reduce((acc, turma) => {
          const alunosDaTurma = alunos.filter((aluno) => aluno.turma === turma.nome)
          const mediaTurma =
            alunosDaTurma.length > 0
              ? alunosDaTurma.reduce((acc, aluno) => acc + aluno.media, 0) / alunosDaTurma.length
              : 0
          return acc + mediaTurma
        }, 0) / minhasTurmas.length
      : 0

  return (
    <DashboardLayout userType="professor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Turmas</h1>
          <p className="text-gray-600">Gerencie suas turmas e acompanhe o desempenho</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total de Turmas" value={minhasTurmas.length} icon={BookOpen} color="blue" />
          <StatsCard title="Total de Alunos" value={totalAlunos} icon={Users} color="green" />
          <StatsCard title="Média Geral" value={mediaGeralTurmas.toFixed(1)} icon={TrendingUp} color="orange" />
        </div>

        {/* Lista de Turmas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {minhasTurmas.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma turma atribuída a você</p>
                <p className="text-sm text-gray-400 mt-2">
                  Entre em contato com a administração para ter turmas atribuídas
                </p>
              </CardContent>
            </Card>
          ) : (
            minhasTurmas.map((turma) => {
              const alunosDaTurma = alunos.filter((aluno) => aluno.turma === turma.nome)
              const mediaTurma =
                alunosDaTurma.length > 0
                  ? alunosDaTurma.reduce((acc, aluno) => acc + aluno.media, 0) / alunosDaTurma.length
                  : 0
              const frequenciaMedia = 95 // Simulado - em um sistema real viria do banco

              return (
                <Card key={turma.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{turma.nome}</CardTitle>
                        <CardDescription>
                          {turma.codigo} • {turma.periodo}
                        </CardDescription>
                      </div>
                      <Badge variant={turma.status === "Ativa" ? "default" : "secondary"}>{turma.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Alunos</span>
                      <span className="font-semibold">{alunosDaTurma.length}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Média da Turma</span>
                        <span className="font-semibold">{mediaTurma.toFixed(1)}</span>
                      </div>
                      <Progress value={(mediaTurma / 10) * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Frequência Média</span>
                        <span className="font-semibold">{frequenciaMedia}%</span>
                      </div>
                      <Progress value={frequenciaMedia} className="h-2" />
                    </div>

                    <div className="pt-2">
                      <Badge variant={mediaTurma >= 7 ? "default" : mediaTurma >= 5 ? "secondary" : "destructive"}>
                        {mediaTurma >= 7 ? "Excelente" : mediaTurma >= 5 ? "Regular" : "Precisa Atenção"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
