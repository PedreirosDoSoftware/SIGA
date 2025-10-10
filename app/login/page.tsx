"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GraduationCap, Mail, Lock, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Usuários de exemplo
      const usuarios = [
        { email: "admin@siga.com", senha: "123456", tipo: "admin", nome: "Administrador" },
        { email: "professor@siga.com", senha: "123456", tipo: "professor", nome: "Prof. João Silva" },
        { email: "aluno@siga.com", senha: "123456", tipo: "aluno", nome: "Maria Santos", matricula: "2024001" },
        { email: "pedagogia@siga.com", senha: "123456", tipo: "pedagogia", nome: "Coord. Ana Costa" },
      ]

      const usuario = usuarios.find((u) => u.email === email && u.senha === senha)

      if (usuario) {
        localStorage.setItem("usuario", JSON.stringify(usuario))

        switch (usuario.tipo) {
          case "admin":
            router.push("/admin/dashboard")
            break
          case "professor":
            router.push("/professor/dashboard")
            break
          case "aluno":
            router.push("/aluno/dashboard")
            break
          case "pedagogia":
            router.push("/pedagogia/dashboard")
            break
        }
      } else {
        setError("Email ou senha incorretos!")
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">SIGA</CardTitle>
          <CardDescription>Sistema Inteligente de Gestão Acadêmica</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="inline h-4 w-4 mr-2" />
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">
                <Lock className="inline h-4 w-4 mr-2" />
                Senha
              </Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Entrando..."
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          <div className="text-center mt-4 text-sm text-gray-600">
            Não possui uma conta?{" "}
            <Link href="/cadastro" className="text-blue-600 hover:underline">
              Cadastre-se aqui
            </Link>
          </div>

          
        </CardContent>
      </Card>
    </div>
  )
}
