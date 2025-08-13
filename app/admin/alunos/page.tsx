"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Users, UserPlus, Search, Edit, Trash2, Save, X } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Aluno {
  id: string
  matricula: string
  nome: string
  turma: string
  nota1: number
  nota2: number
  nota3: number
  media: number
  status: string
}

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null)
  const [formData, setFormData] = useState({
    matricula: "",
    nome: "",
    turma: "",
    nota1: 0,
    nota2: 0,
    nota3: 0,
  })

  useEffect(() => {
    const alunosData = localStorage.getItem("alunos")
    if (alunosData) {
      setAlunos(JSON.parse(alunosData))
    }
  }, [])

  const saveAlunos = (newAlunos: Aluno[]) => {
    setAlunos(newAlunos)
    localStorage.setItem("alunos", JSON.stringify(newAlunos))
  }

  const calcularMedia = (nota1: number, nota2: number, nota3: number) => {
    return (nota1 + nota2 + nota3) / 3
  }

  const determinarStatus = (media: number) => {
    if (media >= 7) return "Aprovado"
    if (media >= 5) return "Recuperação"
    return "Reprovado"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const media = calcularMedia(formData.nota1, formData.nota2, formData.nota3)
    const status = determinarStatus(media)

    if (editingAluno) {
      // Editando aluno existente
      const updatedAlunos = alunos.map((aluno) =>
        aluno.id === editingAluno.id ? { ...formData, id: editingAluno.id, media, status } : aluno,
      )
      saveAlunos(updatedAlunos)
    } else {
      // Adicionando novo aluno
      const novoAluno: Aluno = {
        id: Date.now().toString(),
        ...formData,
        media,
        status,
      }
      saveAlunos([...alunos, novoAluno])
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno)
    setFormData({
      matricula: aluno.matricula,
      nome: aluno.nome,
      turma: aluno.turma,
      nota1: aluno.nota1,
      nota2: aluno.nota2,
      nota3: aluno.nota3,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este aluno?")) {
      const updatedAlunos = alunos.filter((aluno) => aluno.id !== id)
      saveAlunos(updatedAlunos)
    }
  }

  const resetForm = () => {
    setFormData({
      matricula: "",
      nome: "",
      turma: "",
      nota1: 0,
      nota2: 0,
      nota3: 0,
    })
    setEditingAluno(null)
  }

  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.includes(searchTerm) ||
      aluno.turma.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const alunosAprovados = alunos.filter((a) => a.status === "Aprovado").length
  const mediaGeral = alunos.length > 0 ? alunos.reduce((acc, aluno) => acc + aluno.media, 0) / alunos.length : 0

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Alunos</h1>
            <p className="text-gray-600">Gerencie todos os alunos do sistema</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Aluno
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingAluno ? "Editar Aluno" : "Novo Aluno"}</DialogTitle>
                <DialogDescription>
                  {editingAluno ? "Edite as informações do aluno" : "Adicione um novo aluno ao sistema"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    value={formData.matricula}
                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="turma">Turma</Label>
                  <Input
                    id="turma"
                    value={formData.turma}
                    onChange={(e) => setFormData({ ...formData, turma: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="nota1">Nota 1</Label>
                    <Input
                      id="nota1"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={formData.nota1}
                      onChange={(e) => setFormData({ ...formData, nota1: Number.parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="nota2">Nota 2</Label>
                    <Input
                      id="nota2"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={formData.nota2}
                      onChange={(e) => setFormData({ ...formData, nota2: Number.parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="nota3">Nota 3</Label>
                    <Input
                      id="nota3"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={formData.nota3}
                      onChange={(e) => setFormData({ ...formData, nota3: Number.parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {editingAluno ? "Salvar" : "Adicionar"}
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
          <StatsCard title="Total de Alunos" value={alunos.length} icon={Users} color="blue" />
          <StatsCard title="Alunos Aprovados" value={alunosAprovados} icon={Users} color="green" />
          <StatsCard title="Média Geral" value={mediaGeral.toFixed(1)} icon={Users} color="orange" />
        </div>

        {/* Tabela de Alunos */}
        <Card>
          <CardHeader>
            <CardTitle>Alunos Cadastrados</CardTitle>
            <CardDescription>Lista completa de todos os alunos</CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, matrícula ou turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredAlunos.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {alunos.length === 0 ? "Nenhum aluno cadastrado" : "Nenhum aluno encontrado"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Nota 1</TableHead>
                    <TableHead>Nota 2</TableHead>
                    <TableHead>Nota 3</TableHead>
                    <TableHead>Média</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlunos.map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell className="font-medium">{aluno.matricula}</TableCell>
                      <TableCell>{aluno.nome}</TableCell>
                      <TableCell>{aluno.turma}</TableCell>
                      <TableCell>{aluno.nota1.toFixed(1)}</TableCell>
                      <TableCell>{aluno.nota2.toFixed(1)}</TableCell>
                      <TableCell>{aluno.nota3.toFixed(1)}</TableCell>
                      <TableCell className="font-semibold">{aluno.media.toFixed(1)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            aluno.status === "Aprovado"
                              ? "default"
                              : aluno.status === "Recuperação"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {aluno.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(aluno)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(aluno.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
