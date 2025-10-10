"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  GraduationCap,
  Home,
  Users,
  BookOpen,
  Video,
  FileText,
  LogOut,
  Menu,
  X,
  BarChart3,
  Settings,
  PlayCircle,
  Library,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  userType: "admin" | "professor" | "aluno" | "pedagogia"
}

export function Sidebar({ userType }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const router = useRouter()
  const pathname = usePathname()

  // Recolher automaticamente após 3 segundos de inatividade
  useEffect(() => {
    if (isHovered || isMobileOpen) return

    timeoutRef.current = setTimeout(() => {
      setIsCollapsed(true)
    }, 3000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isHovered, isMobileOpen])

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsCollapsed(false)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    timeoutRef.current = setTimeout(() => {
      setIsCollapsed(true)
    }, 500)
  }

  const handleLogout = () => {
    localStorage.removeItem("usuario")
    router.push("/")
  }

  const getMenuItems = () => {
    const baseItems = [{ href: `/${userType}/dashboard`, icon: Home, label: "Dashboard" }]

    switch (userType) {
      case "admin":
        return [
          ...baseItems,
          { href: "/admin/alunos", icon: Users, label: "Alunos" },
          { href: "/admin/turmas", icon: BookOpen, label: "Turmas" },
          { href: "/admin/relatorios", icon: BarChart3, label: "Relatórios" },
          { href: "/admin/configuracoes", icon: Settings, label: "Configurações" },
        ]
      case "professor":
        return [
          ...baseItems,
          { href: "/professor/alunos", icon: Users, label: "Meus Alunos" },
          { href: "/professor/notas", icon: BarChart3, label: "Editar Notas" },
          { href: "/professor/materiais", icon: FileText, label: "Materiais" },
          { href: "/professor/videos", icon: Video, label: "Vídeos" },
        ]
      case "aluno":
        return [
          ...baseItems,
          { href: "/aluno/aulas", icon: PlayCircle, label: "Aulas" },
          { href: "/aluno/livros", icon: Library, label: "Livros" },
          { href: "/aluno/playlists", icon: Video, label: "Playlists" },
          { href: "/aluno/notificacoes", icon: Bell, label: "Notificações" },
        ]
      case "pedagogia":
        return [
          ...baseItems,
          { href: "/pedagogia/alunos", icon: Users, label: "Gestão de Alunos" },
          { href: "/pedagogia/notas", icon: BarChart3, label: "Notas e Faltas" },
          { href: "/pedagogia/turmas", icon: BookOpen, label: "Turmas" },
          { href: "/pedagogia/relatorios", icon: FileText, label: "Relatórios" },
        ]
      default:
        return baseItems
    }
  }

  const menuItems = getMenuItems()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-slate-800 text-white transition-all duration-300 border-r border-slate-700",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-700">
            <GraduationCap className="h-8 w-8 text-blue-400 flex-shrink-0" />
            <h1 
              className={cn(
                "text-xl font-bold transition-opacity duration-300 whitespace-nowrap",
                isCollapsed && "opacity-0 w-0 overflow-hidden"
              )}
            >
              SIGA
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                        isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white",
                        isCollapsed && "justify-center",
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span 
                        className={cn(
                          "transition-opacity duration-300 whitespace-nowrap",
                          isCollapsed && "opacity-0 w-0 overflow-hidden"
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-700">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-slate-300 hover:bg-slate-700 hover:text-white",
                isCollapsed && "justify-center px-2",
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span 
                className={cn(
                  "transition-opacity duration-300 whitespace-nowrap",
                  isCollapsed && "opacity-0 w-0 overflow-hidden"
                )}
              >
                Sair
              </span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Apenas overlay mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  )
}