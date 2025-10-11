"use client"

import { useState, useEffect } from "react"
import { BarChart3, Save, Search } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getAlunos, updateAluno } from "@/lib/supabase/database"

export default function ProfessorNotasPage() {
  const [alunos, setAlunos] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingAluno, setEditingAluno] = useState<string | null>(null)
  const [notasEditadas, setNotasEditadas] = useState<{[key: string]: {nota1: number; nota2: number; nota3: number}}>({})

  useEffect(() => {
    loadAlunos()
  }, [])

  const loadAlunos = async () => {
    try {
      const alunosData = await getAlunos()
      setAlunos(alunosData)
      
      // Inicializar notas editadas
      const initialNotas: any = {}
      alunosData.forEach(aluno => {
        initialNotas[aluno.id] = {
          nota1: aluno.nota1,
          nota2: aluno.nota2,
          nota3: aluno.nota3
        }
      })
      setNotasEditadas(initialNotas)
    } catch (error) {
      console.error('Erro ao carregar alunos:', error)
    }
  }

  const handleEdit = (alunoId: string) => {
    setEditingAluno(alunoId)
  }

  const handleNotaChange = (alunoId: string, nota: 'nota1' | 'nota2' | 'nota3', value: string) => {
    const numValue = parseFloat(value) || 0
    setNotasEditadas(prev => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        [nota]: numValue
      }
    }))
  }

  const handleSave = async (alunoId: string) => {
    try {
      const notas = notasEditadas[alunoId]
      await updateAluno(alunoId, {
        nota1: notas.nota1,
        nota2: notas.nota2,
        nota3: notas.nota3
      })
      
      setEditingAluno(null)
      await loadAlunos() // Recarregar para atualizar médias
    } catch (error) {
      console.error('Erro ao salvar notas:', error)
      alert('Erro ao salvar notas')
    }
  }

  const handleCancel = (alunoId: string) => {
    setEditingAluno(null)
    // Restaurar notas originais
    const aluno = alunos.find(a => a.id === alunoId)
    if (aluno) {
      setNotasEditadas(prev => ({
        ...prev,
        [alunoId]: {
          nota1: aluno.nota1,
          nota2: aluno.nota2,
          nota3: aluno.nota3
        }
      }))
    }
  }

  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.turma.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout userType="professor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Notas</h1>
          <p className="text-gray-600">Atualize as notas dos alunos</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notas dos Alunos</CardTitle>
            <CardDescription>Edite as notas e o sistema calculará automaticamente a média</CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredAlunos.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {alunos.length === 0 ? "Nenhum aluno cadastrado" : "Nenhum aluno encontrado"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
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
                      <TableCell className="font-medium">{aluno.nome}</TableCell>
                      <TableCell>{aluno.turma}</TableCell>
                      
                      {/* Nota 1 */}
                      <TableCell>
                        {editingAluno === aluno.id ? (
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={notasEditadas[aluno.id]?.nota1 || 0}
                            onChange={(e) => handleNotaChange(aluno.id, 'nota1', e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          aluno.nota1.toFixed(1)
                        )}
                      </TableCell>
                      
                      {/* Nota 2 */}
                      <TableCell>
                        {editingAluno === aluno.id ? (
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={notasEditadas[aluno.id]?.nota2 || 0}
                            onChange={(e) => handleNotaChange(aluno.id, 'nota2', e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          aluno.nota2.toFixed(1)
                        )}
                      </TableCell>
                      
                      {/* Nota 3 */}
                      <TableCell>
                        {editingAluno === aluno.id ? (
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={notasEditadas[aluno.id]?.nota3 || 0}
                            onChange={(e) => handleNotaChange(aluno.id, 'nota3', e.target.value)}
                            className="w-20"
                          />
                        ) : (
                          aluno.nota3.toFixed(1)
                        )}
                      </TableCell>
                      
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
                        {editingAluno === aluno.id ? (
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleSave(aluno.id)}>
                              <Save className="h-3 w-3 mr-1" />
                              Salvar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleCancel(aluno.id)}>
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={() => handleEdit(aluno.id)}>
                            Editar
                          </Button>
                        )}
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