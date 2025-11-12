"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { signUp } from "@/lib/supabase/auth"
import { GraduationCap } from "lucide-react"

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    tipo: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validações básicas
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

    if (!formData.tipo) {
      setError("Selecione um tipo de usuário")
      setIsLoading(false)
      return
    }

    try {
      // Cadastro simples - só cria o usuário no Auth
      await signUp(formData.email, formData.password, {
        nome: formData.nome,
        tipo: formData.tipo
      })

      // Se chegou aqui, deu certo
      router.push("/login?message=Cadastro realizado com sucesso! Faça login.")

    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      setError(error.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">SIGA - Cadastro</CardTitle>
          <CardDescription>
            Crie sua conta para acessar o sistema
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
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                disabled={isLoading}
                maxLength={50} 
              />
                <div className={`text-xs text-right ${
                formData.nome.length == 50 ? 'text-red-500' :
                formData.nome.length > 45 ? 'text-orange-500' : 'text-gray-500'
                }`}>
                {formData.nome.length}/50 caracteres
  </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Usuário</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, tipo: value })} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aluno">Aluno</SelectItem>
                  <SelectItem value="professor">Professor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="pedagogia">Pedagogia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                maxLength={12}
              />
              <div className={`text-xs text-right ${
                formData.password.length == 12 ? 'text-red-500' :
                formData.password.length > 10 ? 'text-orange-500' : 'text-gray-500'
                }`}>
                {formData.password.length}/12 caracteres
            </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite novamente sua senha"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={isLoading}
                maxLength={12}
              />
              <div className={`text-xs text-right ${
                formData.confirmPassword.length == 12 ? 'text-red-500' :
                formData.confirmPassword.length > 10 ? 'text-orange-500' : 'text-gray-500' 
                }`}>
                {formData.confirmPassword.length}/12 caracteres
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>Já tem conta? <a href="/login" className="text-blue-600 hover:underline">Faça login</a></p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    
  )
}