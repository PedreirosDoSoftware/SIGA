"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { getCurrentUser, signOut } from "@/lib/auth"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "admin" | "professor" | "aluno" | "pedagogia"
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [usuario, setUsuario] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      if (user.tipo !== userType) {
        await signOut()
        router.push("/login")
        return
      }

      setUsuario(user)
    } catch (error) {
      console.error('Erro de autenticação:', error)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!usuario) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Sidebar userType={userType} />
      <main className="min-h-screen p-4 md:p-6 pt-16 md:pt-6 md:ml-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}