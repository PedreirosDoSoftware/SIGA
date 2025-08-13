"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Video, Plus, Edit, Trash2, Save, X, Play, Upload } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VideoMaterial {
  id: string
  titulo: string
  descricao: string
  categoria: string
  duracao: string
  tipo: "UPLOAD" | "YOUTUBE" | "VIMEO" | "LINK"
  url?: string
  thumbnail?: string
  dataAdicionada: string
  visualizacoes: number
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoMaterial[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoMaterial | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    duracao: "",
    tipo: "",
    url: "",
  })

  useEffect(() => {
    const videosData = localStorage.getItem("videos")
    if (videosData) {
      setVideos(JSON.parse(videosData))
    } else {
      // Simula alguns vídeos iniciais
      const videosSimulados: VideoMaterial[] = [
        {
          id: "1",
          titulo: "Introdução à Álgebra",
          descricao: "Conceitos básicos de álgebra para iniciantes",
          categoria: "Matemática",
          duracao: "15:30",
          tipo: "YOUTUBE",
          url: "https://youtube.com/watch?v=example1",
          thumbnail: "/placeholder.svg?height=120&width=200",
          dataAdicionada: "2024-01-15",
          visualizacoes: 45,
        },
        {
          id: "2",
          titulo: "Equações do 2º Grau",
          descricao: "Resolvendo equações quadráticas passo a passo",
          categoria: "Matemática",
          duracao: "22:15",
          tipo: "UPLOAD",
          thumbnail: "/placeholder.svg?height=120&width=200",
          dataAdicionada: "2024-01-10",
          visualizacoes: 32,
        },
      ]
      setVideos(videosSimulados)
      localStorage.setItem("videos", JSON.stringify(videosSimulados))
    }
  }, [])

  const saveVideos = (newVideos: VideoMaterial[]) => {
    setVideos(newVideos)
    localStorage.setItem("videos", JSON.stringify(newVideos))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingVideo) {
      const updatedVideos = videos.map((video) =>
        video.id === editingVideo.id
          ? {
              ...formData,
              id: editingVideo.id,
              tipo: formData.tipo as "UPLOAD" | "YOUTUBE" | "VIMEO" | "LINK",
              dataAdicionada: editingVideo.dataAdicionada,
              visualizacoes: editingVideo.visualizacoes,
              thumbnail: editingVideo.thumbnail,
            }
          : video,
      )
      saveVideos(updatedVideos)
    } else {
      const novoVideo: VideoMaterial = {
        id: Date.now().toString(),
        ...formData,
        tipo: formData.tipo as "UPLOAD" | "YOUTUBE" | "VIMEO" | "LINK",
        dataAdicionada: new Date().toLocaleDateString("pt-BR"),
        visualizacoes: 0,
        thumbnail: "/placeholder.svg?height=120&width=200",
      }
      saveVideos([...videos, novoVideo])
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (video: VideoMaterial) => {
    setEditingVideo(video)
    setFormData({
      titulo: video.titulo,
      descricao: video.descricao,
      categoria: video.categoria,
      duracao: video.duracao,
      tipo: video.tipo,
      url: video.url || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este vídeo?")) {
      const updatedVideos = videos.filter((video) => video.id !== id)
      saveVideos(updatedVideos)
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      categoria: "",
      duracao: "",
      tipo: "",
      url: "",
    })
    setEditingVideo(null)
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "YOUTUBE":
        return "🎥"
      case "VIMEO":
        return "📹"
      case "UPLOAD":
        return "⬆️"
      case "LINK":
        return "🔗"
      default:
        return "📺"
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "YOUTUBE":
        return "bg-red-100 text-red-800"
      case "VIMEO":
        return "bg-blue-100 text-blue-800"
      case "UPLOAD":
        return "bg-green-100 text-green-800"
      case "LINK":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout userType="professor">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vídeos e Conteúdo Multimídia</h1>
            <p className="text-gray-600">Gerencie vídeos educacionais para seus alunos</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Vídeo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingVideo ? "Editar Vídeo" : "Novo Vídeo"}</DialogTitle>
                <DialogDescription>
                  {editingVideo ? "Edite as informações do vídeo" : "Adicione um novo vídeo educacional"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Título do vídeo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva o conteúdo do vídeo"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="Ex: Matemática, Física, História"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="duracao">Duração</Label>
                  <Input
                    id="duracao"
                    value={formData.duracao}
                    onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                    placeholder="Ex: 15:30"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo de Vídeo</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YOUTUBE">🎥 YouTube</SelectItem>
                      <SelectItem value="VIMEO">📹 Vimeo</SelectItem>
                      <SelectItem value="UPLOAD">⬆️ Upload Direto</SelectItem>
                      <SelectItem value="LINK">🔗 Link Externo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="url">URL do Vídeo</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... ou deixe vazio para upload"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingVideo ? "Salvar" : "Adicionar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Vídeos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum vídeo cadastrado</p>
              </CardContent>
            </Card>
          ) : (
            videos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {video.duracao}
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className={getTipoColor(video.tipo)}>
                      {getTipoIcon(video.tipo)} {video.tipo}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{video.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{video.descricao}</p>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{video.categoria}</Badge>
                    <span className="text-xs text-gray-500">{video.visualizacoes} visualizações</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">Adicionado em {video.dataAdicionada}</div>
                  <div className="flex gap-2">
                    {video.url ? (
                      <Button size="sm" className="flex-1" asChild>
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          <Play className="h-3 w-3 mr-1" />
                          Assistir
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleEdit(video)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(video.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas dos Vídeos</CardTitle>
            <CardDescription>Resumo do seu conteúdo multimídia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{videos.length}</div>
                <div className="text-sm text-gray-600">Total de Vídeos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {videos.reduce((acc, v) => acc + v.visualizacoes, 0)}
                </div>
                <div className="text-sm text-gray-600">Total de Visualizações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {videos.filter((v) => v.tipo === "YOUTUBE").length}
                </div>
                <div className="text-sm text-gray-600">Vídeos do YouTube</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {videos.filter((v) => v.tipo === "UPLOAD").length}
                </div>
                <div className="text-sm text-gray-600">Uploads Diretos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
