"use client"

import { useEffect, useState } from "react"
import { PlayCircle, Library, Video, Bell } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function AlunoDashboard() {
  const [usuario, setUsuario] = useState<any>(null)
  const [notificacoes, setNotificacoes] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("usuario")
    if (userData) {
      setUsuario(JSON.parse(userData))
    }

    // Simula notificações
    const notificacoesSimuladas = [
      {
        id: 1,
        titulo: "Nova aula disponível",
        descricao: "Matemática - Equações do 2º grau",
        tipo: "aula",
        data: "Hoje",
      },
      {
        id: 2,
        titulo: "Novo livro recomendado",
        descricao: "História do Brasil - Período Colonial",
        tipo: "livro",
        data: "Ontem",
      },
      {
        id: 3,
        titulo: "Playlist atualizada",
        descricao: "Física - Mecânica Clássica",
        tipo: "playlist",
        data: "2 dias atrás",
      },
    ]
    setNotificacoes(notificacoesSimuladas)
  }, [])

  const proximasAulas = [
    { titulo: "Matemática - Funções", duracao: "45 min", tipo: "Ao vivo" },
    { titulo: "Português - Literatura", duracao: "30 min", tipo: "Gravada" },
    { titulo: "História - República", duracao: "40 min", tipo: "Ao vivo" },
  ]

  const livrosRecomendados = [
    { titulo: "Matemática Básica", autor: "Prof. Silva", categoria: "Matemática" },
    { titulo: "Gramática Essencial", autor: "Prof. Maria", categoria: "Português" },
    { titulo: "História Contemporânea", autor: "Prof. João", categoria: "História" },
  ]

  return (
    <DashboardLayout userType="aluno">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo, {usuario?.nome}!</h1>
          <p className="text-gray-600">Acesse seus materiais de estudo e acompanhe seu progresso</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Aulas Disponíveis" value="24" icon={PlayCircle} color="blue" />
          <StatsCard title="Livros" value="18" icon={Library} color="green" />
          <StatsCard title="Playlists" value="12" icon={Video} color="orange" />
          <StatsCard title="Notificações" value={notificacoes.length} icon={Bell} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas Aulas */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Aulas</CardTitle>
              <CardDescription>Aulas programadas para você</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proximasAulas.map((aula, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{aula.titulo}</p>
                      <p className="text-sm text-gray-600">{aula.duracao}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={aula.tipo === "Ao vivo" ? "default" : "secondary"}>{aula.tipo}</Badge>
                      <Button size="sm" className="ml-2">
                        Assistir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Livros Recomendados */}
          <Card>
            <CardHeader>
              <CardTitle>Livros Recomendados</CardTitle>
              <CardDescription>Material de apoio para seus estudos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {livrosRecomendados.map((livro, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{livro.titulo}</p>
                      <p className="text-sm text-gray-600">{livro.autor}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{livro.categoria}</Badge>
                      <Button size="sm" variant="outline" className="ml-2 bg-transparent">
                        Ler
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notificações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações Recentes</CardTitle>
            <CardDescription>Últimas atualizações e sugestões</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificacoes.map((notif) => (
                <div key={notif.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      {notif.tipo === "aula" && <PlayCircle className="h-4 w-4 text-blue-600" />}
                      {notif.tipo === "livro" && <Library className="h-4 w-4 text-green-600" />}
                      {notif.tipo === "playlist" && <Video className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{notif.titulo}</p>
                      <p className="text-sm text-gray-600">{notif.descricao}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{notif.data}</p>
                    <Button size="sm" variant="ghost">
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
