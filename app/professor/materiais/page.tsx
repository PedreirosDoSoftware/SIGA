"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FileText, Plus, Edit, Trash2, Save, X, Download, ExternalLink } from "lucide-react"
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

interface Material {
  id: string
  titulo: string
  descricao: string
  tipo: "PDF" | "DOC" | "LINK" | "ARQUIVO"
  link?: string
  arquivo?: string
  categoria: string
  dataAdicionada: string
}

export default function MateriaisPage() {
  const [materiais, setMateriais] = useState<Material[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "",
    link: "",
    categoria: "",
  })

  useEffect(() => {
    const materiaisData = localStorage.getItem("materiais")
    if (materiaisData) {
      setMateriais(JSON.parse(materiaisData))
    }
  }, [])

  const saveMateriais = (newMateriais: Material[]) => {
    setMateriais(newMateriais)
    localStorage.setItem("materiais", JSON.stringify(newMateriais))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingMaterial) {
      const updatedMateriais = materiais.map((material) =>
        material.id === editingMaterial.id
          ? {
              ...formData,
              id: editingMaterial.id,
              tipo: formData.tipo as "PDF" | "DOC" | "LINK" | "ARQUIVO",
              dataAdicionada: editingMaterial.dataAdicionada,
            }
          : material,
      )
      saveMateriais(updatedMateriais)
    } else {
      const novoMaterial: Material = {
        id: Date.now().toString(),
        ...formData,
        tipo: formData.tipo as "PDF" | "DOC" | "LINK" | "ARQUIVO",
        dataAdicionada: new Date().toLocaleDateString("pt-BR"),
      }
      saveMateriais([...materiais, novoMaterial])
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (material: Material) => {
    setEditingMaterial(material)
    setFormData({
      titulo: material.titulo,
      descricao: material.descricao,
      tipo: material.tipo,
      link: material.link || "",
      categoria: material.categoria,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este material?")) {
      const updatedMateriais = materiais.filter((material) => material.id !== id)
      saveMateriais(updatedMateriais)
    }
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      tipo: "",
      link: "",
      categoria: "",
    })
    setEditingMaterial(null)
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "PDF":
        return "📄"
      case "DOC":
        return "📝"
      case "LINK":
        return "🔗"
      case "ARQUIVO":
        return "📁"
      default:
        return "📋"
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "PDF":
        return "bg-red-100 text-red-800"
      case "DOC":
        return "bg-blue-100 text-blue-800"
      case "LINK":
        return "bg-green-100 text-green-800"
      case "ARQUIVO":
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
            <h1 className="text-3xl font-bold text-gray-900">Materiais de Ensino</h1>
            <p className="text-gray-600">Gerencie links, arquivos e documentos para seus alunos</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingMaterial ? "Editar Material" : "Novo Material"}</DialogTitle>
                <DialogDescription>
                  {editingMaterial ? "Edite as informações do material" : "Adicione um novo material de ensino"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Título do material"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva o conteúdo do material"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo de Material</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">📄 Documento PDF</SelectItem>
                      <SelectItem value="DOC">📝 Documento Word</SelectItem>
                      <SelectItem value="LINK">🔗 Link Externo</SelectItem>
                      <SelectItem value="ARQUIVO">📁 Arquivo Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="Ex: Matemática, Exercícios, Teoria"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="link">Link/URL</Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://exemplo.com ou deixe vazio para upload"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingMaterial ? "Salvar" : "Adicionar"}
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

        {/* Lista de Materiais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {materiais.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum material cadastrado</p>
              </CardContent>
            </Card>
          ) : (
            materiais.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>{getTipoIcon(material.tipo)}</span>
                        {material.titulo}
                      </CardTitle>
                      <CardDescription className="mt-2">{material.descricao}</CardDescription>
                    </div>
                    <Badge className={getTipoColor(material.tipo)}>{material.tipo}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Categoria: {material.categoria}</span>
                    <span>{material.dataAdicionada}</span>
                  </div>

                  {material.link && (
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      <span className="text-gray-600">Link: </span>
                      <a
                        href={material.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {material.link}
                      </a>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {material.link ? (
                      <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                        <a href={material.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Acessar
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Download className="h-3 w-3 mr-1" />
                        Baixar
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleEdit(material)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(material.id)}>
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
