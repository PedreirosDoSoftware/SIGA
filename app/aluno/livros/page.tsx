"use client"

import { useState } from "react"
import { Library, Search, Download, BookOpen, Star } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LivrosPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const livros = [
    {
      id: 1,
      titulo: "Matemática Fundamental",
      autor: "Prof. João Silva",
      categoria: "Matemática",
      paginas: 320,
      avaliacao: 4.8,
      descricao: "Conceitos fundamentais de matemática para ensino médio",
      capa: "/livro-matematica.png",
      formato: "PDF",
      tamanho: "15 MB",
    },
    {
      id: 2,
      titulo: "Gramática Essencial",
      autor: "Prof. Maria Santos",
      categoria: "Português",
      paginas: 280,
      avaliacao: 4.6,
      descricao: "Guia completo de gramática da língua portuguesa",
      capa: "/portuguese-book.png",
      formato: "PDF",
      tamanho: "12 MB",
    },
    {
      id: 3,
      titulo: "História do Brasil",
      autor: "Prof. Carlos Oliveira",
      categoria: "História",
      paginas: 450,
      avaliacao: 4.9,
      descricao: "Da colonização aos dias atuais",
      capa: "/livro-historia-brasil.png",
      formato: "PDF",
      tamanho: "25 MB",
    },
    {
      id: 4,
      titulo: "Física Moderna",
      autor: "Prof. Ana Costa",
      categoria: "Física",
      paginas: 380,
      avaliacao: 4.7,
      descricao: "Conceitos de física para o século XXI",
      capa: "/livro-fisica.png",
      formato: "PDF",
      tamanho: "18 MB",
    },
  ]

  const livrosFavoritos = livros.filter((_, index) => index < 2)

  const filteredLivros = livros.filter(
    (livro) =>
      livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livro.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livro.autor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout userType="aluno">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biblioteca</h1>
          <p className="text-gray-600">Acesse livros e materiais de estudo recomendados</p>
        </div>

        <Tabs defaultValue="todos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="todos">Todos os Livros</TabsTrigger>
            <TabsTrigger value="favoritos">Meus Favoritos</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar livros por título, autor ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredLivros.map((livro) => (
                <Card key={livro.id} className="hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={livro.capa || "/placeholder.svg"}
                        alt={livro.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-2">{livro.titulo}</h3>
                      <p className="text-sm text-gray-600">{livro.autor}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{livro.categoria}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{livro.avaliacao}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{livro.descricao}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{livro.paginas} páginas</span>
                        <span>
                          {livro.formato} • {livro.tamanho}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Ler
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favoritos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meus Livros Favoritos</CardTitle>
                <CardDescription>Livros que você marcou como favoritos</CardDescription>
              </CardHeader>
              <CardContent>
                {livrosFavoritos.length === 0 ? (
                  <div className="text-center py-8">
                    <Library className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum livro favoritado ainda</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {livrosFavoritos.map((livro) => (
                      <div key={livro.id} className="flex gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={livro.capa || "/placeholder.svg"}
                            alt={livro.titulo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{livro.titulo}</h4>
                          <p className="text-sm text-gray-600">{livro.autor}</p>
                          <Badge variant="outline" className="mt-1">
                            {livro.categoria}
                          </Badge>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm">Ler</Button>
                            <Button size="sm" variant="outline">
                              Baixar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
