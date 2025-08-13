"use client"

import { useEffect, useState } from "react"
import { Edit, Save, Search, Users } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProfessorNotasPage() {
  const [alunos, setAlunos] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingAluno, setEditingAluno] = useState<string | null>(null)
  const [tempNotas, setTempNotas] = useState<any>({})

  useEffect(() => {
    const alunosData = localStorage.getItem("alunos")
    if (alunosData) {
      setAlunos(JSON.parse(alunosData))
    }
  }, [])

  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.includes(searchTerm) ||
      aluno.turma.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const calcularMedia = (nota1: number, nota2: number, nota3: number) => {
    return (nota1 + nota2 + nota3) / 3
  }

  const determinarStatus = (media: number) => {
    if (media >= 7) return "Aprovado"
    if (media >= 5) return "Recuperação"
    return "Reprovado"
  }

  const iniciarEdicao = (aluno: any) => {
    setEditingAluno(aluno.id)
    setTempNotas({
      nota1: aluno.nota1,
      nota2: aluno.nota2,
      nota3: aluno.nota3,
    })
  }

  const cancelarEdicao = () => {
    setEditingAluno(null)
    setTempNotas({})
  }

  const salvarNotas = (alunoId: string) => {
    const updatedAlunos = alunos.map((aluno) => {
      if (aluno.id === alunoId) {
        const media = calcularMedia(tempNotas.nota1, tempNotas.nota2, tempNotas.nota3)
        const status = determinarStatus(media)
        return {
          ...aluno,
          nota1: tempNotas.nota1,
          nota2: tempNotas.nota2,
          nota3: tempNotas.nota3,
          media,
          status,
        }
      }
      return aluno
    })

    setAlunos(updatedAlunos)
    localStorage.setItem("alunos", JSON.stringify(updatedAlunos))
    setEditingAluno(null)
    setTempNotas({})
  }

  const handleNotaChange = (campo: string, valor: string) => {
    const nota = Number.parseFloat(valor) || 0
    if (nota >= 0 && nota <= 10) {
      setTempNotas({ ...tempNotas, [campo]: nota })
    }
  }

  return (
    <DashboardLayout userType="professor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Notas</h1>
          <p className="text-gray-600">Gerencie as notas dos seus alunos</p>
        </div>

        {/* Busca */}
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, matrícula ou turma..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Tabela de Notas */}
        <Card>
          <CardHeader>
            <CardTitle>Notas dos Alunos</CardTitle>
            <CardDescription>Clique em "Editar" para modificar as notas</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAlunos.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {alunos.length === 0 ? "Nenhum aluno encontrado" : "Nenhum aluno corresponde à busca"}
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
                      <TableCell>
                        {editingAluno === aluno.id ? (
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={tempNotas.nota1}
                            onChange={(e) => handleNotaChange("nota1", e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          aluno.nota1.toFixed(1)
                        )}
                      </TableCell>
                      <TableCell>
                        {editingAluno === aluno.id ? (
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={tempNotas.nota2}
                            onChange={(e) => handleNotaChange("nota2", e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          aluno.nota2.toFixed(1)
                        )}
                      </TableCell>
                      <TableCell>
                        {editingAluno === aluno.id ? (
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={tempNotas.nota3}
                            onChange={(e) => handleNotaChange("nota3", e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          aluno.nota3.toFixed(1)
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {editingAluno === aluno.id
                          ? calcularMedia(tempNotas.nota1, tempNotas.nota2, tempNotas.nota3).toFixed(1)
                          : aluno.media.toFixed(1)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            editingAluno === aluno.id
                              ? determinarStatus(calcularMedia(tempNotas.nota1, tempNotas.nota2, tempNotas.nota3)) ===
                                "Aprovado"
                                ? "default"
                                : determinarStatus(calcularMedia(tempNotas.nota1, tempNotas.nota2, tempNotas.nota3)) ===
                                    "Recuperação"
                                  ? "secondary"
                                  : "destructive"
                              : aluno.status === "Aprovado"
                                ? "default"
                                : aluno.status === "Recuperação"
                                  ? "secondary"
                                  : "destructive"
                          }
                        >
                          {editingAluno === aluno.id
                            ? determinarStatus(calcularMedia(tempNotas.nota1, tempNotas.nota2, tempNotas.nota3))
                            : aluno.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {editingAluno === aluno.id ? (
                            <>
                              <Button variant="default" size="sm" onClick={() => salvarNotas(aluno.id)}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={cancelarEdicao}>
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => iniciarEdicao(aluno)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
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
