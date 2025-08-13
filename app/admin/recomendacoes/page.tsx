"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Lightbulb, Plus, Edit, Trash2, Save, X, ExternalLink } from "lucide-react"
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

interface Recomendacao {
  id: string
  titulo: string
  descricao: string
  link: string
  tipo: "site" | "video" | "livro" | "artigo"
  autor: string
  dataAdicionada: string
}

export default function RecomendacoesPage() {
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecomendacao, setEditingRecomendacao] = useState<Recomendacao | null>(null)
  const [usuario, setUsuario] = useState<any>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    link: "",
    tipo: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("usuario")
    const recomendacoesData = localStorage.getItem("recomendacoes")

    if (userData) {
      setUsuario(JSON.parse(userData))
    }

    if (recomendacoesData) {
      setRecomendacoes(JSON.parse(recomendacoesData))
    }
  }, [])

  const saveRecomendacoes = (newRecomendacoes: Recomendacao[]) => {
    setRecomendacoes(newRecomendacoes)
    localStorage.setItem("recomendacoes", JSON.stringify(newRecomendacoes))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingRecomendacao) {
      const updatedRecomendacoes = recomendacoes.map((rec) =>
        rec.id === editingRecomendacao.id
          ? {
              ...formData,
              id: editingRecomendacao.id,
              autor: editingRecomendacao.autor,
              dataAdicionada: editingRecomendacao.dataAdicionada,
            }
          : rec,
      )
      saveRecomendacoes(updatedRecomendacoes)
    } else {
      const novaRecomendacao: Recomendacao = {
        id: Date.now().toString(),
        ...formData,
        tipo: formData.tipo as "site" | "video" | "livro" | "artigo",
        autor: usuario?.nome || "Admin",
        dataAdicionada: new Date().toLocaleDateString("pt-BR"),
      }
      saveRecomendacoes([...recomendacoes, novaRecomendacao])
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (recomendacao: Recomendacao) => {
    setEditingRecomendacao(recomendacao)
    setFormData({
      titulo: recomendacao.titulo,
      descricao: recomendacao.descricao,
      link: recomendacao.link,
      tipo: recomendacao.tipo,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover esta recomendação?")) {
      const updatedRecomendacoes = recomendacoes.filter((rec) => rec.id !== id)
      saveRecomendacoes(updatedRecomendacoes)
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      link: "",
      tipo: "",
    })
    setEditingRecomendacao(null)
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "site":
        return "bg-blue-100 text-blue-800"
      case "video":
        return "bg-red-100 text-red-800"
      case "livro":
        return "bg-green-100 text-green-800"
      case "artigo":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "site":
        return "🌐"
      case "video":
        return "🎥"
      case "livro":
        return "📚"
      case "artigo":
        return "📄"
      default:
        return "📋"
    }
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recomendações de Estudo</h1>
            <p className="text-gray-600">Gerencie recursos educacionais para alunos e professores</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Recomendação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingRecomendacao ? "Editar Recomendação" : "Nova Recomendação"}</DialogTitle>
                <DialogDescription>
                  {editingRecomendacao
                    ? "Edite as informações da recomendação"
                    : "Adicione um novo recurso educacional"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Título da recomendação"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva o conteúdo e sua utilidade"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://exemplo.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo de Recurso</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site">🌐 Site Educativo</SelectItem>
                      <SelectItem value="video">🎥 Vídeo Aula</SelectItem>
                      <SelectItem value="livro">📚 Livro</SelectItem>
                      <SelectItem value="artigo">📄 Artigo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingRecomendacao ? "Salvar" : "Adicionar"}
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

        {/* Lista de Recomendações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recomendacoes.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma recomendação cadastrada</p>
              </CardContent>
            </Card>
          ) : (
            recomendacoes.map((recomendacao) => (
              <Card key={recomendacao.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>{getTipoIcon(recomendacao.tipo)}</span>
                        {recomendacao.titulo}
                      </CardTitle>
                      <CardDescription className="mt-2">{recomendacao.descricao}</CardDescription>
                    </div>
                    <Badge className={getTipoColor(recomendacao.tipo)}>{recomendacao.tipo}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Por: {recomendacao.autor}</span>
                    <span>{recomendacao.dataAdicionada}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                      <a href={recomendacao.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Acessar
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(recomendacao)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(recomendacao.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
