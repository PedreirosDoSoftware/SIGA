import Link from "next/link"
import { GraduationCap, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <GraduationCap className="h-16 w-16 text-blue-600 animate-bounce" />
          <h1 className="text-6xl font-bold text-slate-800">SIGA</h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-slate-700">SISTEMA INTELIGENTE</h2>
          <h3 className="text-2xl font-medium text-slate-600">DE GESTÃO ACADÊMICA</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
          <Link href="/login">
            <Button size="lg" className="w-48 h-16 text-lg flex flex-col gap-2">
              <LogIn className="h-6 w-6" />
              Acessar Sistema
            </Button>
          </Link>

          <Link href="/cadastro">
            <Button variant="outline" size="lg" className="w-48 h-16 text-lg flex flex-col gap-2 bg-transparent">
              <UserPlus className="h-6 w-6" />
              Criar Conta
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
