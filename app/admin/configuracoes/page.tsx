"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConfiguracoesPage() {
  const [configuracoes, setConfiguracoes] = useState({
    nomeInstituicao: "SIGA - Sistema Inteligente de Gestão Acadêmica",
    emailAdmin: "admin@siga.com",
    notificacoesEmail: true,
    notificacoesPush: true,
    backupAutomatico: true,
    manutencao: false,
    limiteAlunos: 1000,
    mensagemManutencao: "Sistema em manutenção. Voltaremos em breve.",
  })

  const handleSave = () => {
    localStorage.setItem("configuracoes", JSON.stringify(configuracoes))
    alert("Configurações salvas com sucesso!")
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-600">Gerencie as configurações gerais do SIGA</p>
        </div>

        <Tabs defaultValue="geral" className="space-y-6">
          <TabsList>
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            <TabsTrigger value="sistema">Sistema</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="geral">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>Informações básicas da instituição</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nomeInstituicao">Nome da Instituição</Label>
                  <Input
                    id="nomeInstituicao"
                    value={configuracoes.nomeInstituicao}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, nomeInstituicao: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="emailAdmin">Email do Administrador</Label>
                  <Input
                    id="emailAdmin"
                    type="email"
                    value={configuracoes.emailAdmin}
                    onChange={(e) => setConfiguracoes({ ...configuracoes, emailAdmin: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="limiteAlunos">Limite de Alunos</Label>
                  <Input
                    id="limiteAlunos"
                    type="number"
                    value={configuracoes.limiteAlunos}
                    onChange={(e) =>
                      setConfiguracoes({ ...configuracoes, limiteAlunos: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>Gerencie como as notificações são enviadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por Email</Label>
                    <p className="text-sm text-gray-600">Enviar notificações por email para usuários</p>
                  </div>
                  <Switch
                    checked={configuracoes.notificacoesEmail}
                    onCheckedChange={(checked) => setConfiguracoes({ ...configuracoes, notificacoesEmail: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações Push</Label>
                    <p className="text-sm text-gray-600">Enviar notificações push no sistema</p>
                  </div>
                  <Switch
                    checked={configuracoes.notificacoesPush}
                    onCheckedChange={(checked) => setConfiguracoes({ ...configuracoes, notificacoesPush: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sistema">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>Configurações técnicas e de manutenção</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup Automático</Label>
                    <p className="text-sm text-gray-600">Realizar backup automático dos dados</p>
                  </div>
                  <Switch
                    checked={configuracoes.backupAutomatico}
                    onCheckedChange={(checked) => setConfiguracoes({ ...configuracoes, backupAutomatico: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Manutenção</Label>
                    <p className="text-sm text-gray-600">Ativar modo de manutenção do sistema</p>
                  </div>
                  <Switch
                    checked={configuracoes.manutencao}
                    onCheckedChange={(checked) => setConfiguracoes({ ...configuracoes, manutencao: checked })}
                  />
                </div>

                {configuracoes.manutencao && (
                  <div>
                    <Label htmlFor="mensagemManutencao">Mensagem de Manutenção</Label>
                    <Textarea
                      id="mensagemManutencao"
                      value={configuracoes.mensagemManutencao}
                      onChange={(e) => setConfiguracoes({ ...configuracoes, mensagemManutencao: e.target.value })}
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seguranca">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
                <CardDescription>Configurações de segurança e acesso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Logs de Acesso</h4>
                  <p className="text-sm text-gray-600 mb-3">Visualizar logs de acesso ao sistema</p>
                  <Button variant="outline">Ver Logs</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Backup de Dados</h4>
                  <p className="text-sm text-gray-600 mb-3">Fazer backup manual dos dados</p>
                  <Button variant="outline">Fazer Backup</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Restaurar Sistema</h4>
                  <p className="text-sm text-gray-600 mb-3">Restaurar sistema a partir de backup</p>
                  <Button variant="outline">Restaurar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
