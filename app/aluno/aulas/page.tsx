"use client"

import { useState } from "react"
import { PlayCircle, Clock, Users, Search } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AulasPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const aulasAoVivo = [
    {
      id: 1,
      titulo: "Matemática - Equações do 2º Grau",
      professor: "Prof. João Silva",
      horario: "14:00",
      duracao: "45 min",
      participantes: 28,
      status: "Em breve",
    },
    {
      id: 2,
      titulo: "Português - Análise Sintática",
      professor: "Prof. Maria Santos",
      horario: "15:00",
      duracao: "50 min",
      participantes: 32,
      status: "Ao vivo",
    },
  ]

  const aulasGravadas = [
    {
      id: 1,
      titulo: "História - Período Colonial",
      professor: "Prof. Carlos Oliveira",
      duracao: "35 min",
      visualizacoes: 156,
      categoria: "História",
      thumbnail: "/colonial-history.png",
    },
    {
      id: 2,
      titulo: "Física - Leis de Newton",
      professor: "Prof. Ana Costa",
      duracao: "42 min",
      visualizacoes: 203,
      categoria: "Física",
      thumbnail: "/placeholder-ddw1e.png",
    },
    {
      id: 3,
      titulo: "Química - Tabela Periódica",
      professor: "Prof. Pedro Lima",
      duracao: "38 min",
      visualizacoes: 189,
      categoria: "Química",
      thumbnail: "/periodic-table-chemistry.png",
    },
  ]

  const filteredAulasGravadas = aulasGravadas.filter(
    (aula) =>
      aula.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aula.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout userType="aluno">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Aulas</h1>
          <p className="text-gray-600">Assista aulas ao vivo e acesse conteúdo gravado</p>
        </div>

        <Tabs defaultValue="ao-vivo" className="space-y-6">
          <TabsList>
            <TabsTrigger value="ao-vivo">Aulas ao Vivo</TabsTrigger>
            <TabsTrigger value="gravadas">Aulas Gravadas</TabsTrigger>
          </TabsList>

          <TabsContent value="ao-vivo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aulas ao Vivo</CardTitle>
                <CardDescription>Participe das aulas em tempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aulasAoVivo.map((aula) => (
                    <div key={aula.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-full">
                          <PlayCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{aula.titulo}</h3>
                          <p className="text-sm text-gray-600">{aula.professor}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {aula.horario} - {aula.duracao}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {aula.participantes} alunos
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={aula.status === "Ao vivo" ? "destructive" : "secondary"}>{aula.status}</Badge>
                        <Button className="ml-3" disabled={aula.status === "Em breve"}>
                          {aula.status === "Ao vivo" ? "Entrar" : "Aguardar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gravadas" className="space-y-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar aulas gravadas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAulasGravadas.map((aula) => (
                <Card key={aula.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                    <img
                      src={aula.thumbnail || "/placeholder.svg"}
                      alt={aula.titulo}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <PlayCircle className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {aula.duracao}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{aula.titulo}</h3>
                    <p className="text-sm text-gray-600 mb-2">{aula.professor}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{aula.categoria}</Badge>
                      <span className="text-xs text-gray-500">{aula.visualizacoes} visualizações</span>
                    </div>
                    <Button className="w-full mt-3">Assistir</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
