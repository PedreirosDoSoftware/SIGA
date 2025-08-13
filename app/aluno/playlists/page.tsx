"use client"

import { useState } from "react"
import { Video, Play, Clock, Search, BookOpen } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export default function PlaylistsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const playlists = [
    {
      id: 1,
      titulo: "Matemática Completa",
      categoria: "Matemática",
      professor: "Prof. João Silva",
      videos: 24,
      duracaoTotal: "8h 45min",
      progresso: 65,
      thumbnail: "/matematica-playlist.png",
      descricao: "Curso completo de matemática para ensino médio",
      ultimoVideo: "Equações do 2º grau - Parte 3",
    },
    {
      id: 2,
      titulo: "Português Essencial",
      categoria: "Português",
      professor: "Prof. Maria Santos",
      videos: 18,
      duracaoTotal: "6h 30min",
      progresso: 40,
      thumbnail: "/portuguese-playlist.png",
      descricao: "Gramática e literatura portuguesa",
      ultimoVideo: "Análise sintática - Introdução",
    },
    {
      id: 3,
      titulo: "História do Brasil",
      categoria: "História",
      professor: "Prof. Carlos Oliveira",
      videos: 32,
      duracaoTotal: "12h 15min",
      progresso: 25,
      thumbnail: "/historia-brasil-playlist.png",
      descricao: "Da colonização aos dias atuais",
      ultimoVideo: "Período Colonial - Economia",
    },
    {
      id: 4,
      titulo: "Física Moderna",
      categoria: "Física",
      professor: "Prof. Ana Costa",
      videos: 28,
      duracaoTotal: "10h 20min",
      progresso: 80,
      thumbnail: "/placeholder.svg?height=120&width=200",
      descricao: "Conceitos fundamentais de física",
      ultimoVideo: "Relatividade - Conclusão",
    },
  ]

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.professor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getProgressColor = (progresso: number) => {
    if (progresso >= 80) return "bg-green-500"
    if (progresso >= 50) return "bg-blue-500"
    if (progresso >= 25) return "bg-yellow-500"
    return "bg-gray-300"
  }

  return (
    <DashboardLayout userType="aluno">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Playlists</h1>
          <p className="text-gray-600">Acompanhe seu progresso nos cursos em vídeo</p>
        </div>

        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar playlists por título, categoria ou professor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPlaylists.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma playlist encontrada</p>
              </CardContent>
            </Card>
          ) : (
            filteredPlaylists.map((playlist) => (
              <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
                <div className="flex">
                  <div className="w-48 h-32 bg-gray-200 rounded-l-lg overflow-hidden flex-shrink-0">
                    <img
                      src={playlist.thumbnail || "/placeholder.svg"}
                      alt={playlist.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{playlist.titulo}</h3>
                      <Badge variant="outline">{playlist.categoria}</Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{playlist.professor}</p>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{playlist.descricao}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        {playlist.videos} vídeos
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {playlist.duracaoTotal}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Progresso</span>
                        <span className="text-sm text-gray-600">{playlist.progresso}%</span>
                      </div>
                      <Progress value={playlist.progresso} className="h-2" />
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-500">Último vídeo assistido:</p>
                      <p className="text-sm font-medium">{playlist.ultimoVideo}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Play className="h-3 w-3 mr-1" />
                        Continuar
                      </Button>
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Ver Lista
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Estatísticas de Progresso */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Progresso</CardTitle>
            <CardDescription>Seu desempenho geral nas playlists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{playlists.length}</div>
                <div className="text-sm text-gray-600">Playlists Ativas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {playlists.reduce((acc, p) => acc + p.videos, 0)}
                </div>
                <div className="text-sm text-gray-600">Total de Vídeos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(playlists.reduce((acc, p) => acc + p.progresso, 0) / playlists.length)}%
                </div>
                <div className="text-sm text-gray-600">Progresso Médio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {playlists.filter((p) => p.progresso >= 80).length}
                </div>
                <div className="text-sm text-gray-600">Playlists Concluídas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
