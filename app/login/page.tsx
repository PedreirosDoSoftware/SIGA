"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { signIn, getCurrentUser } from "@/lib/supabase/auth"
import { GraduationCap } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { user } = await signIn(email, password)
      
      if (user) {
        // Buscar dados completos do usuário
        const userData = await getCurrentUser()
        
        if (userData) {
          // Redirecionar baseado no tipo de usuário
          switch (userData.tipo) {
            case 'admin':
              router.push('/admin/dashboard')
              break
            case 'professor':
              router.push('/professor/dashboard') 
              break
            case 'aluno':
              router.push('/aluno/dashboard')
              break
            case 'pedagogia':
              router.push('/pedagogia/dashboard')
              break
            default:
              router.push('/')
          }
        }
      }
    } catch (error: any) {
      console.error('Erro no login:', error)
      setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
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
          <CardTitle className="text-2xl font-bold">SIGA - Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                maxLength={12}
              />
              <div className={`text-xs text-right ${
                password.length == 12 ? 'text-red-500' :
                password.length > 10 ? 'text-orange-500' : 'text-gray-500'
                }`}>
                {password.length}/12 caracteres
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>Não tem conta? <a href="/cadastro" className="text-blue-600 hover:underline">Cadastre-se</a></p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}