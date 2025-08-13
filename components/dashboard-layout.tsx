"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "admin" | "professor" | "aluno" | "pedagogia"
}

interface Usuario {
  nome: string
  email: string
  tipo: string
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("usuario")
    if (!userData) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userData)
    if (user.tipo !== userType) {
      router.push("/login")
      return
    }

    setUsuario(user)
  }, [userType, router])

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userType={userType} />
      <main className="md:ml-64 transition-all duration-300">
        <div className="p-4 md:p-6 pt-16 md:pt-6">{children}</div>
      </main>
    </div>
  )
}
