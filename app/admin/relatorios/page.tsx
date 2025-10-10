"use client"

import { useEffect, useState } from "react"
import { BarChart3, Download, Calendar, Users, BookOpen, TrendingUp } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function RelatoriosPage() {
  const [alunos, setAlunos] = useState<any[]>([])
  const [turmas, setTurmas] = useState<any[]>([])

  useEffect(() => {
    const alunosData = localStorage.getItem("alunos")
    const turmasData = localStorage.getItem("turmas")

    if (alunosData) {
      setAlunos(JSON.parse(alunosData))
    }

    if (turmasData) {
      setTurmas(JSON.parse(turmasData))
    }
  }, [])

  const mediaGeral = alunos.length > 0 ? alunos.reduce((acc, aluno) => acc + aluno.media, 0) / alunos.length : 0
  const alunosAprovados = alunos.filter((a) => a.media >= 7).length
  const alunosRecuperacao = alunos.filter((a) => a.media >= 5 && a.media < 7).length
  const alunosReprovados = alunos.filter((a) => a.media < 5).length

  const relatoriosPorTurma = turmas.map((turma) => {
    const alunosDaTurma = alunos.filter((a) => a.turma === turma.nome)
    const mediaTurma =
      alunosDaTurma.length > 0 ? alunosDaTurma.reduce((acc, a) => acc + a.media, 0) / alunosDaTurma.length : 0

    return {
      ...turma,
      totalAlunos: alunosDaTurma.length,
      media: mediaTurma,
      aprovados: alunosDaTurma.filter((a) => a.media >= 7).length,
      recuperacao: alunosDaTurma.filter((a) => a.media >= 5 && a.media < 7).length,
      reprovados: alunosDaTurma.filter((a) => a.media < 5).length,
    }
  })

  const exportarRelatorio = (tipo: string) => {
    alert(`Exportando relatório: ${tipo}`)
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Análises e estatísticas do sistema acadêmico</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportarRelatorio("Geral")}>
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline" onClick={() => exportarRelatorio("Excel")}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total de Alunos" value={alunos.length} icon={Users} color="blue" />
          <StatsCard title="Total de Turmas" value={turmas.length} icon={BookOpen} color="green" />
          <StatsCard title="Média Geral" value={mediaGeral.toFixed(1)} icon={TrendingUp} color="orange" />
          <StatsCard
            title="Taxa de Aprovação"
            value={`${((alunosAprovados / alunos.length) * 100).toFixed(1)}%`}
            icon={BarChart3}
            color="green"
          />
        </div>

        {/* Gráfico de Desempenho Geral */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho Geral dos Alunos</CardTitle>
            <CardDescription>Distribuição de alunos por situação acadêmica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Aprovados (+ 7.0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{alunosAprovados}</span>
                  <span className="text-sm text-gray-500">
                    ({((alunosAprovados / alunos.length) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <Progress value={(alunosAprovados / alunos.length) * 100} className="h-3" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Recuperação (5.0 - 6.9)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{alunosRecuperacao}</span>
                  <span className="text-sm text-gray-500">
                    ({((alunosRecuperacao / alunos.length) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <Progress value={(alunosRecuperacao / alunos.length) * 100} className="h-3" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Reprovados (- 5.0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{alunosReprovados}</span>
                  <span className="text-sm text-gray-500">
                    ({((alunosReprovados / alunos.length) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <Progress value={(alunosReprovados / alunos.length) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Relatório por Turma */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho por Turma</CardTitle>
            <CardDescription>Análise detalhada de cada turma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatoriosPorTurma.map((turma) => (
                <div key={turma.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{turma.nome}</h4>
                      <p className="text-sm text-gray-600">{turma.codigo}</p>
                    </div>
                    <Badge variant={turma.media >= 7 ? "default" : turma.media >= 5 ? "secondary" : "destructive"}>
                      Média: {turma.media.toFixed(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{turma.totalAlunos}</div>
                      <div className="text-gray-600">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{turma.aprovados}</div>
                      <div className="text-gray-600">Aprovados</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-yellow-600">{turma.recuperacao}</div>
                      <div className="text-gray-600">Recuperação</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-red-600">{turma.reprovados}</div>
                      <div className="text-gray-600">Reprovados</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress value={(turma.aprovados / turma.totalAlunos) * 100} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      Taxa de aprovação: {((turma.aprovados / turma.totalAlunos) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Gerar relatórios específicos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={() => exportarRelatorio("Alunos em Risco")}>
                <Calendar className="h-4 w-4 mr-2" />
                Alunos em Risco
              </Button>
              <Button variant="outline" onClick={() => exportarRelatorio("Frequência")}>
                <Users className="h-4 w-4 mr-2" />
                Relatório de Frequência
              </Button>
              <Button variant="outline" onClick={() => exportarRelatorio("Desempenho Mensal")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Desempenho Mensal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
