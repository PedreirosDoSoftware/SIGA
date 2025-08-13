"use client"

import { useEffect, useState } from "react"
import { Users, UserCheck, UserX, Search, AlertTriangle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"

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
  ativo: boolean
  faltas: number
}

export default function PedagogiaAlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const alunosData = localStorage.getItem("alunos")
    if (alunosData) {
      const alunosComStatus = JSON.parse(alunosData).map((aluno: any) => ({
        ...aluno,
        ativo: aluno.ativo !== false,
        faltas: aluno.faltas || Math.floor(Math.random() * 10),
      }))
      setAlunos(alunosComStatus)
    }
  }, [])

  const saveAlunos = (newAlunos: Aluno[]) => {
    setAlunos(newAlunos)
    localStorage.setItem("alunos", JSON.stringify(newAlunos))
  }

  const toggleAlunoStatus = (id: string) => {
    const updatedAlunos = alunos.map((aluno) => (aluno.id === id ? { ...aluno, ativo: !aluno.ativo } : aluno))
    saveAlunos(updatedAlunos)
  }

  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.includes(searchTerm) ||
      aluno.turma.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const alunosAtivos = alunos.filter((a) => a.ativo).length
  const alunosInativos = alunos.filter((a) => !a.ativo).length
  const alunosEmRisco = alunos.filter((a) => a.media < 6 || a.faltas > 5).length

  return (
    <DashboardLayout userType="pedagogia">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Alunos</h1>
          <p className="text-gray-600">Gerencie o status e acompanhe o desempenho dos alunos</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{alunos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold">{alunosAtivos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <UserX className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inativos</p>
                  <p className="text-2xl font-bold">{alunosInativos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Em Risco</p>
                  <p className="text-2xl font-bold">{alunosEmRisco}</p>
                </div>
              </div>
            </CardContent>
          </Card>
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

        {/* Tabela de Alunos */}
        <Card>
          <CardHeader>
            <CardTitle>Gestão de Alunos</CardTitle>
            <CardDescription>Ative/desative alunos e monitore seu desempenho</CardDescription>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Média</TableHead>
                    <TableHead>Faltas</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlunos.map((aluno) => (
                    <TableRow key={aluno.id} className={!aluno.ativo ? "opacity-60 bg-gray-50" : ""}>
                      <TableCell>
                        <Switch checked={aluno.ativo} onCheckedChange={() => toggleAlunoStatus(aluno.id)} />
                      </TableCell>
                      <TableCell className="font-medium">{aluno.matricula}</TableCell>
                      <TableCell>{aluno.nome}</TableCell>
                      <TableCell>{aluno.turma}</TableCell>
                      <TableCell className="font-semibold">{aluno.media.toFixed(1)}</TableCell>
                      <TableCell>
                        <span className={aluno.faltas > 5 ? "text-red-600 font-semibold" : ""}>{aluno.faltas}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
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
                          {(aluno.media < 6 || aluno.faltas > 5) && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Risco
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant={aluno.ativo ? "destructive" : "default"}
                            size="sm"
                            onClick={() => toggleAlunoStatus(aluno.id)}
                          >
                            {aluno.ativo ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
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
