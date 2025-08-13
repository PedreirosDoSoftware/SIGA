"use client"

import { useState, useEffect } from "react"
import { Bell, Mail, PlayCircle, Library, Video, Check, Trash2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notificacao {
  id: number
  titulo: string
  descricao: string
  tipo: "aula" | "livro" | "playlist" | "sistema"
  data: string
  lida: boolean
  email: boolean
}

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])

  useEffect(() => {
    // Simula notificações
    const notificacoesSimuladas: Notificacao[] = [
      {
        id: 1,
        titulo: "Nova aula disponível",
        descricao: "Matemática - Equações do 2º grau está disponível para assistir",
        tipo: "aula",
        data: "Há 2 horas",
        lida: false,
        email: true,
      },
      {
        id: 2,
        titulo: "Livro recomendado",
        descricao: "História do Brasil - Período Colonial foi adicionado à sua biblioteca",
        tipo: "livro",
        data: "Ontem",
        lida: false,
        email: true,
      },
      {
        id: 3,
        titulo: "Playlist atualizada",
        descricao: "Física Moderna recebeu 3 novos vídeos",
        tipo: "playlist",
        data: "2 dias atrás",
        lida: true,
        email: false,
      },
      {
        id: 4,
        titulo: "Lembrete de estudo",
        descricao: "Você não acessa suas aulas há 3 dias. Que tal continuar seus estudos?",
        tipo: "sistema",
        data: "3 dias atrás",
        lida: false,
        email: true,
      },
      {
        id: 5,
        titulo: "Nova sugestão de conteúdo",
        descricao: "Com base no seu progresso, recomendamos o livro 'Química Orgânica'",
        tipo: "livro",
        data: "1 semana atrás",
        lida: true,
        email: true,
      },
    ]
    setNotificacoes(notificacoesSimuladas)
  }, [])

  const marcarComoLida = (id: number) => {
    setNotificacoes((prev) => prev.map((notif) => (notif.id === id ? { ...notif, lida: true } : notif)))
  }

  const removerNotificacao = (id: number) => {
    setNotificacoes((prev) => prev.filter((notif) => notif.id !== id))
  }

  const marcarTodasComoLidas = () => {
    setNotificacoes((prev) => prev.map((notif) => ({ ...notif, lida: true })))
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "aula":
        return <PlayCircle className="h-5 w-5 text-blue-600" />
      case "livro":
        return <Library className="h-5 w-5 text-green-600" />
      case "playlist":
        return <Video className="h-5 w-5 text-orange-600" />
      case "sistema":
        return <Bell className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const notificacoesNaoLidas = notificacoes.filter((n) => !n.lida)
  const notificacoesComEmail = notificacoes.filter((n) => n.email)

  return (
    <DashboardLayout userType="aluno">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
            <p className="text-gray-600">Acompanhe suas atualizações e sugestões de estudo</p>
          </div>
          {notificacoesNaoLidas.length > 0 && (
            <Button onClick={marcarTodasComoLidas} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{notificacoes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Bell className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Não lidas</p>
                  <p className="text-2xl font-bold">{notificacoesNaoLidas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Enviadas por email</p>
                  <p className="text-2xl font-bold">{notificacoesComEmail.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="todas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="todas">Todas ({notificacoes.length})</TabsTrigger>
            <TabsTrigger value="nao-lidas">Não lidas ({notificacoesNaoLidas.length})</TabsTrigger>
            <TabsTrigger value="email">Enviadas por email ({notificacoesComEmail.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="todas">
            <div className="space-y-4">
              {notificacoes.map((notificacao) => (
                <Card key={notificacao.id} className={`${!notificacao.lida ? "border-blue-200 bg-blue-50" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">{getIcon(notificacao.tipo)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-semibold ${!notificacao.lida ? "text-blue-900" : "text-gray-900"}`}>
                              {notificacao.titulo}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{notificacao.descricao}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-500">{notificacao.data}</span>
                              {notificacao.email && (
                                <Badge variant="outline" className="text-xs">
                                  <Mail className="h-3 w-3 mr-1" />
                                  Email enviado
                                </Badge>
                              )}
                              {!notificacao.lida && (
                                <Badge variant="default" className="text-xs">
                                  Nova
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!notificacao.lida && (
                              <Button size="sm" variant="ghost" onClick={() => marcarComoLida(notificacao.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => removerNotificacao(notificacao.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nao-lidas">
            <div className="space-y-4">
              {notificacoesNaoLidas.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500">Todas as notificações foram lidas!</p>
                  </CardContent>
                </Card>
              ) : (
                notificacoesNaoLidas.map((notificacao) => (
                  <Card key={notificacao.id} className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">{getIcon(notificacao.tipo)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-blue-900">{notificacao.titulo}</h3>
                              <p className="text-sm text-gray-600 mt-1">{notificacao.descricao}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-gray-500">{notificacao.data}</span>
                                {notificacao.email && (
                                  <Badge variant="outline" className="text-xs">
                                    <Mail className="h-3 w-3 mr-1" />
                                    Email enviado
                                  </Badge>
                                )}
                                <Badge variant="default" className="text-xs">
                                  Nova
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => marcarComoLida(notificacao.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => removerNotificacao(notificacao.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="email">
            <div className="space-y-4">
              {notificacoesComEmail.map((notificacao) => (
                <Card key={notificacao.id} className={`${!notificacao.lida ? "border-blue-200 bg-blue-50" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">{getIcon(notificacao.tipo)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-semibold ${!notificacao.lida ? "text-blue-900" : "text-gray-900"}`}>
                              {notificacao.titulo}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{notificacao.descricao}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-500">{notificacao.data}</span>
                              {notificacao.email && (
                                <Badge variant="outline" className="text-xs">
                                  <Mail className="h-3 w-3 mr-1" />
                                  Email enviado
                                </Badge>
                              )}
                              {!notificacao.lida && (
                                <Badge variant="default" className="text-xs">
                                  Nova
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!notificacao.lida && (
                              <Button size="sm" variant="ghost" onClick={() => marcarComoLida(notificacao.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => removerNotificacao(notificacao.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
