"use client"

import { useEffect, useState } from "react"
import { Users, Search, Eye } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ProfessorAlunosPage() {
  const [alunos, setAlunos] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const alunosData = localStorage.getItem("alunos")
    if (alunosData) {
      // Simula que o professor tem acesso a todos os alunos
      // Em um sistema real, seria filtrado por turmas do professor
      setAlunos(JSON.parse(alunosData))
    }
  }, [])

  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.includes(searchTerm) ||
      aluno.turma.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const verDetalhes = (aluno: any) => {
    alert(
      `Detalhes do aluno: ${aluno.nome}\nMatrícula: ${aluno.matricula}\nTurma: ${aluno.turma}\nMédia: ${aluno.media.toFixed(1)}`,
    )
  }

  return (
    <DashboardLayout userType="professor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Alunos</h1>
          <p className="text-gray-600">Visualize informações dos seus alunos</p>
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
            <CardTitle>Lista de Alunos</CardTitle>
            <CardDescription>Informações acadêmicas dos seus alunos</CardDescription>
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
                          <Button variant="ghost" size="sm" onClick={() => verDetalhes(aluno)}>
                            <Eye className="h-4 w-4" />
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
