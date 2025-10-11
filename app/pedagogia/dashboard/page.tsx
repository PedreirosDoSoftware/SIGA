"use client"

import { Users, BookOpen, BarChart3, TrendingUp } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getAlunos } from "@/lib/supabase/database/alunos"
import { getTurmas } from "@/lib/supabase/database/turmas"

export default function PedagogiaDashboardPage() {
  const [stats, setStats] = useState({
    totalAlunos: 0,
    totalTurmas: 0,
    taxaAprovacao: 0,
    alunosRecuperacao: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const [alunos, turmas] = await Promise.all([
      getAlunos(),
      getTurmas()
    ])

    const aprovados = alunos.filter(a => a.status === 'Aprovado').length
    const recuperacao = alunos.filter(a => a.status === 'Recuperação').length
    const taxaAprovacao = alunos.length > 0 ? (aprovados / alunos.length) * 100 : 0

    setStats({
      totalAlunos: alunos.length,
      totalTurmas: turmas.length,
      taxaAprovacao,
      alunosRecuperacao: recuperacao
    })
  }

  return (
    <DashboardLayout userType="pedagogia">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Pedagogia</h1>
          <p className="text-gray-600">Visão geral pedagógica do sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alunos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAlunos}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Turmas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTurmas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.taxaAprovacao.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Recuperação</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.alunosRecuperacao}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}