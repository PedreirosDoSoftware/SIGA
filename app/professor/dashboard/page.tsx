"use client"

import { useEffect, useState } from "react"
import { Users, BookOpen, Edit, Video } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProfessorDashboard() {
  const [alunos, setAlunos] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [materiais, setMateriais] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("usuario")
    const alunosData = localStorage.getItem("alunos")
    const materiaisData = localStorage.getItem("materiais")

    if (userData) {
      setUsuario(JSON.parse(userData))
    }

    if (alunosData) {
      setAlunos(JSON.parse(alunosData))
    }

    if (materiaisData) {
      setMateriais(JSON.parse(materiaisData))
    } else {
      // Simula alguns materiais
      const materiaisSimulados = [
        { id: 1, titulo: "Apostila de Matemática", tipo: "PDF", data: "Hoje" },
        { id: 2, titulo: "Exercícios de Álgebra", tipo: "DOC", data: "Ontem" },
        { id: 3, titulo: "Vídeo - Equações", tipo: "MP4", data: "2 dias atrás" },
      ]
      setMateriais(materiaisSimulados)
    }
  }, [])

  // Simula alunos do professor
  const meusAlunos = alunos.slice(0, 8) // Pega os primeiros 8 alunos como exemplo
  const alunosComBaixaMedia = meusAlunos.filter((aluno) => aluno.media < 6)
  const mediaGeral =
    meusAlunos.length > 0 ? meusAlunos.reduce((acc, aluno) => acc + aluno.media, 0) / meusAlunos.length : 0

  return (
    <DashboardLayout userType="professor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Professor</h1>
          <p className="text-gray-600">Gerencie suas turmas e materiais de ensino</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Meus Alunos" value={meusAlunos.length} icon={Users} color="blue" />
          <StatsCard title="Materiais" value={materiais.length} icon={BookOpen} color="green" />
          <StatsCard title="Média Geral" value={mediaGeral.toFixed(1)} icon={Edit} color="orange" />
          <StatsCard title="Alunos em Risco" value={alunosComBaixaMedia.length} icon={Users} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alunos que Precisam de Atenção */}
          <Card>
            <CardHeader>
              <CardTitle>Alunos que Precisam de Atenção</CardTitle>
              <CardDescription>Estudantes com média abaixo de 6.0</CardDescription>
            </CardHeader>
            <CardContent>
              {alunosComBaixaMedia.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Todos os alunos estão com bom desempenho!</p>
              ) : (
                <div className="space-y-4">
                  {alunosComBaixaMedia.map((aluno, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{aluno.nome}</p>
                        <p className="text-sm text-gray-600">{aluno.turma}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">{aluno.media.toFixed(1)}</p>
                        <Badge variant="destructive">Atenção</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Materiais Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Materiais Recentes</CardTitle>
              <CardDescription>Últimos materiais adicionados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {materiais.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        {material.tipo === "PDF" && <BookOpen className="h-4 w-4 text-blue-600" />}
                        {material.tipo === "DOC" && <Edit className="h-4 w-4 text-green-600" />}
                        {material.tipo === "MP4" && <Video className="h-4 w-4 text-red-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{material.titulo}</p>
                        <p className="text-sm text-gray-600">{material.data}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{material.tipo}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/professor/notas">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                  <Edit className="h-6 w-6" />
                  <span>Editar Notas</span>
                </Button>
              </Link>

              <Link href="/professor/materiais">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                  <BookOpen className="h-6 w-6" />
                  <span>Materiais</span>
                </Button>
              </Link>

              <Link href="/professor/videos">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                  <Video className="h-6 w-6" />
                  <span>Vídeos</span>
                </Button>
              </Link>

              <Link href="/professor/alunos">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                  <Users className="h-6 w-6" />
                  <span>Meus Alunos</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
