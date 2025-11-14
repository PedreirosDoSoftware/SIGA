"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BookOpen, Users, Plus, Edit, Trash2, Save, X } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface Turma {
  id: string
  codigo: string
  nome: string
  professor: string
  periodo: string
  anoLetivo: string
  status: string
}

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [alunos, setAlunos] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null)
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    professor: "",
    periodo: "",
    anoLetivo: new Date().getFullYear().toString(),
    status: "Ativa",
  })

  useEffect(() => {
    const turmasData = localStorage.getItem("turmas")
    const alunosData = localStorage.getItem("alunos")

    if (turmasData) {
      setTurmas(JSON.parse(turmasData))
    }

    if (alunosData) {
      setAlunos(JSON.parse(alunosData))
    }
  }, [])

  const saveTurmas = (newTurmas: Turma[]) => {
    setTurmas(newTurmas)
    localStorage.setItem("turmas", JSON.stringify(newTurmas))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTurma) {
      const updatedTurmas = turmas.map((turma) =>
        turma.id === editingTurma.id ? { ...formData, id: editingTurma.id } : turma,
      )
      saveTurmas(updatedTurmas)
    } else {
      const novaTurma: Turma = {
        id: Date.now().toString(),
        ...formData,
      }
      saveTurmas([...turmas, novaTurma])
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma)
    setFormData({
      codigo: turma.codigo,
      nome: turma.nome,
      professor: turma.professor,
      periodo: turma.periodo,
      anoLetivo: turma.anoLetivo,
      status: turma.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover esta turma?")) {
      const updatedTurmas = turmas.filter((turma) => turma.id !== id)
      saveTurmas(updatedTurmas)
    }
  }

  const resetForm = () => {
    setFormData({
      codigo: "",
      nome: "",
      professor: "",
      periodo: "",
      anoLetivo: new Date().getFullYear().toString(),
      status: "Ativa",
    })
    setEditingTurma(null)
  }

  const getAlunosPorTurma = (nomeTurma: string) => {
    return alunos.filter((aluno) => aluno.turma === nomeTurma).length
  }

  const turmasAtivas = turmas.filter((t) => t.status === "Ativa").length
  const totalAlunos = alunos.length

  return (
    <DashboardLayout userType="pedagogia">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Turmas</h1>
            <p className="text-gray-600">Gerencie todas as turmas do sistema</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Turma
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingTurma ? "Editar Turma" : "Nova Turma"}</DialogTitle>
                <DialogDescription>
                  {editingTurma ? "Edite as informações da turma" : "Adicione uma nova turma ao sistema"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="codigo">Código da Turma</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    placeholder="Ex: TUR2024A"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nome">Nome da Turma</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: 3º Ano A"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="professor">Professor Responsável</Label>
                  <Input
                    id="professor"
                    value={formData.professor}
                    onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                    placeholder="Nome do professor"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="periodo">Período</Label>
                  <Select
                    value={formData.periodo}
                    onValueChange={(value) => setFormData({ ...formData, periodo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manhã">Manhã</SelectItem>
                      <SelectItem value="Tarde">Tarde</SelectItem>
                      <SelectItem value="Noite">Noite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="anoLetivo">Ano Letivo</Label>
                  <Input
                    id="anoLetivo"
                    value={formData.anoLetivo}
                    onChange={(e) => setFormData({ ...formData, anoLetivo: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativa">Ativa</SelectItem>
                      <SelectItem value="Inativa">Inativa</SelectItem>
                      <SelectItem value="Encerrada">Encerrada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingTurma ? "Salvar" : "Adicionar"}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total de Turmas" value={turmas.length} icon={BookOpen} color="blue" />
          <StatsCard title="Turmas Ativas" value={turmasAtivas} icon={BookOpen} color="green" />
          <StatsCard title="Total de Alunos" value={totalAlunos} icon={Users} color="orange" />
        </div>

        {/* Lista de Turmas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {turmas.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma turma cadastrada</p>
              </CardContent>
            </Card>
          ) : (
            turmas.map((turma) => (
              <Card key={turma.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{turma.nome}</CardTitle>
                      <CardDescription>{turma.codigo}</CardDescription>
                    </div>
                    <Badge variant={turma.status === "Ativa" ? "default" : "secondary"}>{turma.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Professor</span>
                    <span className="font-medium text-sm">{turma.professor}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Período</span>
                    <span className="font-medium text-sm">{turma.periodo}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ano Letivo</span>
                    <span className="font-medium text-sm">{turma.anoLetivo}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Alunos</span>
                    <span className="font-semibold">{getAlunosPorTurma(turma.nome)}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(turma)} className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(turma.id)} className="flex-1">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Excluir
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