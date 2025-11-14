"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ClipboardList, Users, Edit, Save, X, Search, AlertCircle } from "lucide-react"
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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Aluno {
  id: string
  nome: string
  turma: string
  nota1: number
  nota2: number
  nota3: number
  nota4: number
  media: number
  faltas: number
  totalAulas: number
}

export default function NotasFaltasPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([])
  const [turmas, setTurmas] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTurma, setSelectedTurma] = useState("todas")
  const [formData, setFormData] = useState({
    nota1: 0,
    nota2: 0,
    nota3: 0,
    nota4: 0,
    faltas: 0,
    totalAulas: 200,
  })

  useEffect(() => {
    const alunosData = localStorage.getItem("alunos")
    const turmasData = localStorage.getItem("turmas")

    if (alunosData) {
      const parsedAlunos = JSON.parse(alunosData)
      setAlunos(parsedAlunos)
      setFilteredAlunos(parsedAlunos)
    }

    if (turmasData) {
      setTurmas(JSON.parse(turmasData))
    }
  }, [])

  useEffect(() => {
    let result = alunos

    // Filtro por turma
    if (selectedTurma !== "todas") {
      result = result.filter((aluno) => aluno.turma === selectedTurma)
    }

    // Filtro por busca
    if (searchTerm) {
      result = result.filter((aluno) =>
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredAlunos(result)
  }, [searchTerm, selectedTurma, alunos])

  const saveAlunos = (newAlunos: Aluno[]) => {
    setAlunos(newAlunos)
    localStorage.setItem("alunos", JSON.stringify(newAlunos))
  }

  const calcularMedia = (n1: number, n2: number, n3: number, n4: number) => {
    return (n1 + n2 + n3 + n4) / 4
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingAluno) {
      const media = calcularMedia(formData.nota1, formData.nota2, formData.nota3, formData.nota4)
      
      const updatedAlunos = alunos.map((aluno) =>
        aluno.id === editingAluno.id
          ? {
              ...aluno,
              nota1: formData.nota1,
              nota2: formData.nota2,
              nota3: formData.nota3,
              nota4: formData.nota4,
              media: parseFloat(media.toFixed(1)),
              faltas: formData.faltas,
              totalAulas: formData.totalAulas,
            }
          : aluno
      )
      saveAlunos(updatedAlunos)
    }

    setIsDialogOpen(false)
    setEditingAluno(null)
  }

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno)
    setFormData({
      nota1: aluno.nota1 || 0,
      nota2: aluno.nota2 || 0,
      nota3: aluno.nota3 || 0,
      nota4: aluno.nota4 || 0,
      faltas: aluno.faltas || 0,
      totalAulas: aluno.totalAulas || 200,
    })
    setIsDialogOpen(true)
  }

  const getStatusAluno = (media: number, faltas: number, totalAulas: number) => {
    const frequencia = ((totalAulas - faltas) / totalAulas) * 100
    
    if (frequencia < 75) {
      return { status: "Reprovado por Falta", color: "destructive" as const }
    }
    if (media >= 7) {
      return { status: "Aprovado", color: "default" as const }
    }
    if (media >= 5) {
      return { status: "Recuperação", color: "secondary" as const }
    }
    return { status: "Reprovado", color: "destructive" as const }
  }

  const calcularFrequencia = (faltas: number, totalAulas: number) => {
    return ((totalAulas - faltas) / totalAulas) * 100
  }

  // Estatísticas
  const mediaGeral = alunos.length > 0 
    ? alunos.reduce((acc, aluno) => acc + (aluno.media || 0), 0) / alunos.length 
    : 0
  const aprovados = alunos.filter((a) => a.media >= 7 && calcularFrequencia(a.faltas || 0, a.totalAulas || 200) >= 75).length
  const emRecuperacao = alunos.filter((a) => a.media >= 5 && a.media < 7 && calcularFrequencia(a.faltas || 0, a.totalAulas || 200) >= 75).length

  return (
    <DashboardLayout userType="professor">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notas e Faltas</h1>
            <p className="text-gray-600">Gerencie as notas e frequência dos alunos</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Total de Alunos" value={alunos.length} icon={Users} color="blue" />
          <StatsCard title="Média Geral" value={mediaGeral.toFixed(1)} icon={ClipboardList} color="green" />
          <StatsCard title="Aprovados" value={aprovados} icon={ClipboardList} color="green" />
          <StatsCard title="Em Recuperação" value={emRecuperacao} icon={AlertCircle} color="orange" />
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Busque e filtre os alunos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search">Buscar Aluno</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Digite o nome do aluno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="turma">Filtrar por Turma</Label>
                <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Turmas</SelectItem>
                    {turmas.map((turma) => (
                      <SelectItem key={turma.id} value={turma.nome}>
                        {turma.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Alunos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Alunos</CardTitle>
            <CardDescription>Clique em "Editar" para lançar notas e faltas</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAlunos.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum aluno encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlunos.map((aluno) => {
                  const frequencia = calcularFrequencia(aluno.faltas || 0, aluno.totalAulas || 200)
                  const statusInfo = getStatusAluno(aluno.media || 0, aluno.faltas || 0, aluno.totalAulas || 200)
                  
                  return (
                    <div key={aluno.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">{aluno.nome}</h4>
                            <Badge variant={statusInfo.color}>{statusInfo.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Turma: {aluno.turma}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                          <div>
                            <div className="text-xs text-gray-500">1º Bim</div>
                            <div className="font-semibold">{aluno.nota1?.toFixed(1) || "0.0"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">2º Bim</div>
                            <div className="font-semibold">{aluno.nota2?.toFixed(1) || "0.0"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">3º Bim</div>
                            <div className="font-semibold">{aluno.nota3?.toFixed(1) || "0.0"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">4º Bim</div>
                            <div className="font-semibold">{aluno.nota4?.toFixed(1) || "0.0"}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Média</div>
                            <div className={`font-bold ${aluno.media >= 7 ? "text-green-600" : aluno.media >= 5 ? "text-yellow-600" : "text-red-600"}`}>
                              {aluno.media?.toFixed(1) || "0.0"}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Frequência</div>
                            <div className={`font-bold ${frequencia >= 75 ? "text-green-600" : "text-red-600"}`}>
                              {frequencia.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <Button variant="outline" size="sm" onClick={() => handleEdit(aluno)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </div>

                      {frequencia < 75 && (
                        <Alert variant="destructive" className="mt-3">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Atenção: Frequência abaixo de 75% ({aluno.faltas} faltas de {aluno.totalAulas || 200} aulas)
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de Edição */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Notas e Faltas</DialogTitle>
              <DialogDescription>
                Aluno: {editingAluno?.nome}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nota1">1º Bimestre</Label>
                  <Input
                    id="nota1"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.nota1}
                    onChange={(e) => setFormData({ ...formData, nota1: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nota2">2º Bimestre</Label>
                  <Input
                    id="nota2"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.nota2}
                    onChange={(e) => setFormData({ ...formData, nota2: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nota3">3º Bimestre</Label>
                  <Input
                    id="nota3"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.nota3}
                    onChange={(e) => setFormData({ ...formData, nota3: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nota4">4º Bimestre</Label>
                  <Input
                    id="nota4"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.nota4}
                    onChange={(e) => setFormData({ ...formData, nota4: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">
                  Média Final: {calcularMedia(formData.nota1, formData.nota2, formData.nota3, formData.nota4).toFixed(1)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="faltas">Faltas</Label>
                  <Input
                    id="faltas"
                    type="number"
                    min="0"
                    value={formData.faltas}
                    onChange={(e) => setFormData({ ...formData, faltas: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="totalAulas">Total de Aulas</Label>
                  <Input
                    id="totalAulas"
                    type="number"
                    min="0"
                    value={formData.totalAulas}
                    onChange={(e) => setFormData({ ...formData, totalAulas: parseInt(e.target.value) || 200 })}
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-900">
                  Frequência: {calcularFrequencia(formData.faltas, formData.totalAulas).toFixed(1)}%
                </p>
                {calcularFrequencia(formData.faltas, formData.totalAulas) < 75 && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Abaixo do mínimo exigido (75%)</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
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
    </DashboardLayout>
  )
}