"use client"

import { useEffect, useState } from "react"
import { BookOpen, TrendingUp, Award, AlertCircle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AlunoNotasPage() {
  const [alunos, setAlunos] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [meusDados, setMeusDados] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("usuario")
    const alunosData = localStorage.getItem("alunos")

    if (userData) {
      const user = JSON.parse(userData)
      setUsuario(user)

      if (alunosData) {
        const todosAlunos = JSON.parse(alunosData)
        setAlunos(todosAlunos)

        // Encontra os dados do aluno logado
        const meuPerfil = todosAlunos.find(
          (aluno: any) =>
            aluno.nome.toLowerCase().includes(user.nome.toLowerCase()) || aluno.matricula === user.matricula,
        )

        if (meuPerfil) {
          setMeusDados(meuPerfil)
        }
      }
    }
  }, [])

  if (!meusDados) {
    return (
      <DashboardLayout userType="aluno">
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Suas notas não foram encontradas</p>
            <p className="text-sm text-gray-400 mt-2">Entre em contato com a secretaria para verificar seu cadastro</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  // Simula disciplinas baseadas nas notas do aluno
  const disciplinas = [
    {
      nome: "Matemática",
      professor: "Prof. João Silva",
      nota1: meusDados.nota1,
      nota2: meusDados.nota2 * 0.9, // Varia um pouco para simular
      nota3: meusDados.nota3 * 1.1,
      media: meusDados.nota1,
      situacao: meusDados.nota1 >= 7 ? "Aprovado" : meusDados.nota1 >= 5 ? "Recuperação" : "Reprovado",
      faltas: Math.floor(Math.random() * 5),
    },
    {
      nome: "Português",
      professor: "Prof. Maria Santos",
      nota1: meusDados.nota2 * 0.95,
      nota2: meusDados.nota2,
      nota3: meusDados.nota2 * 1.05,
      media: meusDados.nota2,
      situacao: meusDados.nota2 >= 7 ? "Aprovado" : meusDados.nota2 >= 5 ? "Recuperação" : "Reprovado",
      faltas: Math.floor(Math.random() * 3),
    },
    {
      nome: "História",
      professor: "Prof. Carlos Oliveira",
      nota1: meusDados.nota3 * 0.85,
      nota2: meusDados.nota3 * 1.1,
      nota3: meusDados.nota3,
      media: meusDados.nota3,
      situacao: meusDados.nota3 >= 7 ? "Aprovado" : meusDados.nota3 >= 5 ? "Recuperação" : "Reprovado",
      faltas: Math.floor(Math.random() * 4),
    },
  ]

  const mediaGeral = meusDados.media
  const disciplinasAprovado = disciplinas.filter((d) => d.media >= 7).length
  const totalFaltas = disciplinas.reduce((acc, disc) => acc + disc.faltas, 0)

  // Calcula posição na turma
  const alunosDaTurma = alunos.filter((aluno) => aluno.turma === meusDados.turma)
  const posicaoNaTurma =
    alunosDaTurma.sort((a, b) => b.media - a.media).findIndex((aluno) => aluno.id === meusDados.id) + 1

  return (
    <DashboardLayout userType="aluno">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Notas</h1>
          <p className="text-gray-600">Acompanhe seu desempenho em todas as disciplinas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Média Geral" value={mediaGeral.toFixed(1)} icon={TrendingUp} color="blue" />
          <StatsCard title="Disciplinas" value={disciplinas.length} icon={BookOpen} color="green" />
          <StatsCard title="Aprovado em" value={disciplinasAprovado} icon={Award} color="green" />
          <StatsCard title="Total de Faltas" value={totalFaltas} icon={AlertCircle} color="orange" />
        </div>

        {/* Informações do Aluno */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Acadêmicas</CardTitle>
            <CardDescription>Seus dados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Matrícula</p>
                <p className="font-semibold">{meusDados.matricula}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Turma</p>
                <p className="font-semibold">{meusDados.turma}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status Geral</p>
                <Badge variant={meusDados.status === "Aprovado" ? "default" : "destructive"}>{meusDados.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Posição na Turma</p>
                <p className="font-semibold">{posicaoNaTurma}º lugar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Desempenho */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho por Disciplina</CardTitle>
            <CardDescription>Visualização das suas notas e médias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {disciplinas.map((disciplina, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{disciplina.nome}</h4>
                      <p className="text-sm text-gray-600">{disciplina.professor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{disciplina.media.toFixed(1)}</p>
                      <Badge
                        variant={
                          disciplina.situacao === "Aprovado"
                            ? "default"
                            : disciplina.situacao === "Recuperação"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {disciplina.situacao}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={(disciplina.media / 10) * 100} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>N1: {disciplina.nota1.toFixed(1)}</span>
                    <span>N2: {disciplina.nota2.toFixed(1)}</span>
                    <span>N3: {disciplina.nota3.toFixed(1)}</span>
                    <span>Faltas: {disciplina.faltas}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabela Detalhada */}
        <Card>
          <CardHeader>
            <CardTitle>Boletim Detalhado</CardTitle>
            <CardDescription>Todas as suas notas e informações acadêmicas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>1ª Nota</TableHead>
                  <TableHead>2ª Nota</TableHead>
                  <TableHead>3ª Nota</TableHead>
                  <TableHead>Média</TableHead>
                  <TableHead>Faltas</TableHead>
                  <TableHead>Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disciplinas.map((disciplina, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{disciplina.nome}</TableCell>
                    <TableCell>{disciplina.professor}</TableCell>
                    <TableCell>{disciplina.nota1.toFixed(1)}</TableCell>
                    <TableCell>{disciplina.nota2.toFixed(1)}</TableCell>
                    <TableCell>{disciplina.nota3.toFixed(1)}</TableCell>
                    <TableCell className="font-semibold">{disciplina.media.toFixed(1)}</TableCell>
                    <TableCell>{disciplina.faltas}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          disciplina.situacao === "Aprovado"
                            ? "default"
                            : disciplina.situacao === "Recuperação"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {disciplina.situacao}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
