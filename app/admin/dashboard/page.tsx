"use client"

import { useEffect, useState } from "react"
import { Users, BookOpen, AlertTriangle, TrendingUp } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
}

export default function AdminDashboard() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [turmas, setTurmas] = useState<any[]>([])

  useEffect(() => {
    // Carrega dados do localStorage
    const alunosData = localStorage.getItem("alunos")
    const turmasData = localStorage.getItem("turmas")

    if (alunosData) {
      setAlunos(JSON.parse(alunosData))
    }

    if (turmasData) {
      setTurmas(JSON.parse(turmasData))
    }
  }, [])

  const alunosComAlerta = alunos.filter((aluno) => aluno.media < 6)
  const mediaGeral = alunos.length > 0 ? alunos.reduce((acc, aluno) => acc + aluno.media, 0) / alunos.length : 0

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600">Visão geral do sistema acadêmico</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total de Alunos" value={alunos.length} icon={Users} color="blue" />
          <StatsCard title="Total de Turmas" value={turmas.length} icon={BookOpen} color="green" />
          <StatsCard title="Alunos em Risco" value={alunosComAlerta.length} icon={AlertTriangle} color="orange" />
          <StatsCard title="Média Geral" value={mediaGeral.toFixed(1)} icon={TrendingUp} color="green" />
        </div>

        {/* Alunos com Alerta */}
        <Card>
          <CardHeader>
            <CardTitle>Alunos que Precisam de Atenção</CardTitle>
            <CardDescription>Estudantes com média abaixo de 6.0</CardDescription>
          </CardHeader>
          <CardContent>
            {alunosComAlerta.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum aluno com alerta no momento</p>
            ) : (
              <div className="space-y-4">
                {alunosComAlerta.map((aluno) => (
                  <div key={aluno.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{aluno.nome}</p>
                      <p className="text-sm text-gray-600">
                        {aluno.turma} - Matrícula: {aluno.matricula}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">Média: {aluno.media.toFixed(1)}</p>
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Risco
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
