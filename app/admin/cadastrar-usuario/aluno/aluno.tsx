"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { signUp } from "@/lib/supabase/auth"
import { createAluno } from "@/lib/supabase/database"
import { GraduationCap } from "lucide-react"

export default function CadastroAlunoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    matricula: "",
    turma: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (!formData.matricula) {
      setError("Matrícula é obrigatória")
      setIsLoading(false)
      return
    }

    if (!formData.turma) {
      setError("Turma é obrigatória")
      setIsLoading(false)
      return
    }

    try {
  // 1. Criar usuário no Auth
  const authData = await signUp(formData.email, formData.password, {
    nome: formData.nome,
    tipo: "aluno"
  })

  console.log('🔍 DEBUG - Auth Data:', authData)
  console.log('🔍 DEBUG - User ID:', authData.user?.id)

  if (!authData.user?.id) {
    throw new Error('ID do usuário não foi retornado pelo processo de autenticação')
  }

  // 2. Criar aluno na tabela alunos
  await createAluno({
    matricula: formData.matricula,
    nome: formData.nome,
    turma: formData.turma,
    nota1: 0,
    nota2: 0,
    nota3: 0,
    user_id: authData.user.id  // ✅ Agora a função createAluno aceita user_id
  })

  // Sucesso
  router.push("/login?message=Aluno cadastrado com sucesso! Faça login.")

} catch (error: any) {
  console.error('❌ Erro no cadastro:', error)
  setError(error.message || 'Erro ao cadastrar aluno.')
} finally {
  setIsLoading(false)
}

  }
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Cadastro de Aluno</CardTitle>
          <CardDescription>
            Preencha os dados para criar uma conta de aluno
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                placeholder="Número de matrícula"
                value={formData.matricula}
                onChange={(e) => handleChange('matricula', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="turma">Turma</Label>
              <Input
                id="turma"
                placeholder="Ex: 1A, 2B, etc."
                value={formData.turma}
                onChange={(e) => handleChange('turma', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite novamente sua senha"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar Aluno"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>Já tem conta? <a href="/login" className="text-blue-600 hover:underline">Faça login</a></p>
              <p>É professor? <a href="/cadastro/professor" className="text-blue-600 hover:underline">Cadastre-se aqui</a></p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}