
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, BarChart, Users, Settings, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface MasterTraderDashboardProps {
  onCancelMasterTrader?: () => void;
}

const MasterTraderDashboard = ({ onCancelMasterTrader }: MasterTraderDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for demonstration purposes
  const mockData = {
    totalEarnings: 2543.75,
    activeFollowers: 18,
    weeklyGrowth: 15.3,
    monthlyGrowth: 27.8,
    recentTrades: [
      { id: 1, date: "2023-06-18", symbol: "BTC/USDT", type: "LONG", profit: 127.35, followers: 14 },
      { id: 2, date: "2023-06-17", symbol: "ETH/USDT", type: "SHORT", profit: -45.20, followers: 12 },
      { id: 3, date: "2023-06-16", symbol: "SOL/USDT", type: "LONG", profit: 78.60, followers: 15 },
      { id: 4, date: "2023-06-15", symbol: "ADA/USDT", type: "SHORT", profit: 32.10, followers: 11 },
      { id: 5, date: "2023-06-14", symbol: "BNB/USDT", type: "LONG", profit: 164.25, followers: 16 },
    ],
    followers: [
      { id: 1, since: "2023-05-10", volume: 5420.75, revenue: 54.21 },
      { id: 2, since: "2023-04-22", volume: 8750.30, revenue: 87.50 },
      { id: 3, since: "2023-06-01", volume: 1320.45, revenue: 13.20 },
      { id: 4, since: "2023-05-15", volume: 4500.00, revenue: 45.00 },
      { id: 5, since: "2023-03-28", volume: 12350.80, revenue: 123.51 },
    ],
    balances: {
      available: 2543.75,
      pending: 468.50,
      total: 3012.25
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Ganhos</p>
                <p className="text-2xl font-bold">${mockData.totalEarnings.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Seguidores Ativos</p>
                <p className="text-2xl font-bold">{mockData.activeFollowers}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Crescimento Semanal</p>
                <p className="text-2xl font-bold">+{mockData.weeklyGrowth}%</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <BarChart className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Crescimento Mensal</p>
                <p className="text-2xl font-bold">+{mockData.monthlyGrowth}%</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <BarChart className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Dashboard Tabs */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
          <CardTitle>Dashboard do Master Trader</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">
                <BarChart className="mr-2 h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="wallet">
                <Wallet className="mr-2 h-4 w-4" />
                Carteira
              </TabsTrigger>
              <TabsTrigger value="followers">
                <Users className="mr-2 h-4 w-4" />
                Seguidores
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Trades Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Par</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Lucro/Perda</TableHead>
                        <TableHead className="text-right">Seguidores</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockData.recentTrades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
                          <TableCell>{trade.symbol}</TableCell>
                          <TableCell className={trade.type === "LONG" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                            {trade.type}
                          </TableCell>
                          <TableCell className={`text-right ${trade.profit > 0 ? "text-green-600" : "text-red-600"}`}>
                            {trade.profit > 0 ? "+" : ""}{trade.profit.toFixed(2)} USDT
                          </TableCell>
                          <TableCell className="text-right">{trade.followers}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Desempenho</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Win Rate</span>
                          <span className="font-medium">68%</span>
                        </div>
                        <Progress value={68} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Taxa de Crescimento</span>
                          <span className="font-medium">44%</span>
                        </div>
                        <Progress value={44} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Seguidores Ativos</span>
                          <span className="font-medium">72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Próximos Passos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 bg-green-100 p-1 rounded-full">
                          <FileText className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm">Compartilhe sua estratégia para atrair mais seguidores</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 bg-blue-100 p-1 rounded-full">
                          <FileText className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-sm">Configure alertas para ficar atento às tendências de mercado</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 bg-amber-100 p-1 rounded-full">
                          <FileText className="h-3 w-3 text-amber-600" />
                        </div>
                        <span className="text-sm">Crie um perfil detalhado para destacar sua experiência</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 bg-purple-100 p-1 rounded-full">
                          <FileText className="h-3 w-3 text-purple-600" />
                        </div>
                        <span className="text-sm">Interaja com a comunidade para aumentar sua visibilidade</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="wallet" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Saldo do Master Trader</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Disponível</span>
                        <span className="font-medium">${mockData.balances.available.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pendente</span>
                        <span className="font-medium">${mockData.balances.pending.toFixed(2)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">${mockData.balances.total.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-md text-sm text-green-700">
                        Como Master Trader, você não paga taxas e tem acesso a todas as funcionalidades da plataforma.
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <Button className="w-full">Solicitar Saque</Button>
                      <Button variant="outline" className="w-full">Ver Histórico de Pagamentos</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Resumo de Ganhos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Este Mês</span>
                        <span className="font-medium">$487.25</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mês Passado</span>
                        <span className="font-medium">$895.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total 2023</span>
                        <span className="font-medium">$2,543.75</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between">
                        <span className="font-medium">Média Mensal</span>
                        <span className="font-bold">$635.94</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Histórico de Ganhos</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{new Date('2023-06-01').toLocaleDateString()}</TableCell>
                        <TableCell>Comissão de Seguidores</TableCell>
                        <TableCell className="text-right">+$125.75</TableCell>
                        <TableCell className="text-right"><span className="text-green-600">Pago</span></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{new Date('2023-05-15').toLocaleDateString()}</TableCell>
                        <TableCell>Comissão de Seguidores</TableCell>
                        <TableCell className="text-right">+$203.40</TableCell>
                        <TableCell className="text-right"><span className="text-green-600">Pago</span></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{new Date('2023-05-01').toLocaleDateString()}</TableCell>
                        <TableCell>Comissão de Seguidores</TableCell>
                        <TableCell className="text-right">+$158.10</TableCell>
                        <TableCell className="text-right"><span className="text-green-600">Pago</span></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{new Date('2023-04-15').toLocaleDateString()}</TableCell>
                        <TableCell>Comissão de Seguidores</TableCell>
                        <TableCell className="text-right">+$178.25</TableCell>
                        <TableCell className="text-right"><span className="text-green-600">Pago</span></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="followers" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Seus Seguidores</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Desde</TableHead>
                        <TableHead className="text-right">Volume</TableHead>
                        <TableHead className="text-right">Geração de Receita</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockData.followers.map((follower) => (
                        <TableRow key={follower.id}>
                          <TableCell>#{follower.id.toString().padStart(5, '0')}</TableCell>
                          <TableCell>{new Date(follower.since).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">${follower.volume.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${follower.revenue.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Estatísticas de Seguidores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total de Seguidores</span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Novos este Mês</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxa de Retenção</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volume Total</span>
                        <span className="font-medium">$32,342.30</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Aumentar Seguidores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Compartilhe seu perfil de master trader para atrair mais seguidores
                      </p>
                      <div className="flex items-center space-x-2">
                        <Input 
                          readOnly 
                          value="https://vastcopy.com/trader/your-id" 
                          className="bg-muted"
                        />
                        <Button variant="outline" size="sm">Copiar</Button>
                      </div>
                      <div className="flex justify-between gap-2">
                        <Button variant="outline" className="flex-1">
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          Twitter
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" />
                          </svg>
                          Facebook
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Configurações do Master Trader</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="strategy-name">Nome da Estratégia</Label>
                      <Input 
                        id="strategy-name"
                        defaultValue="Scalping BTC/ETH"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="trader-bio">Bio do Trader</Label>
                      <textarea 
                        id="trader-bio"
                        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="Trader com mais de 5 anos de experiência em mercados de criptomoedas, especializado em scalping e swing trading de Bitcoin e Ethereum."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Visibilidade do Perfil</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="profile-visibility" defaultChecked />
                        <Label htmlFor="profile-visibility">Mostrar no marketplace de traders</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Aceitar Novos Seguidores</Label>
                      <div className="flex items-center space-x-2">
                        <Switch id="accept-followers" defaultChecked />
                        <Label htmlFor="accept-followers">Permitir que novos usuários sigam suas trades</Label>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-sm text-amber-700 mb-4">
                      <p><strong>Lembrete:</strong> Como Master Trader, você não pode seguir outros traders, mas pode ser seguido por outros usuários.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price-tier">Nível de Preço</Label>
                      <select 
                        id="price-tier"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        defaultValue="standard"
                      >
                        <option value="basic">Básico ($9.99/mês)</option>
                        <option value="standard">Padrão ($19.99/mês)</option>
                        <option value="premium">Premium ($49.99/mês)</option>
                        <option value="custom">Personalizado</option>
                      </select>
                    </div>
                    
                    <Button className="w-full mt-6">
                      Salvar Configurações
                    </Button>
                    
                    <hr className="my-6" />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-lg text-red-600">Desativar status de Master Trader</h3>
                      <p className="text-sm text-gray-600">
                        Ao deixar de ser Master Trader, você voltará a pagar taxas normalmente e perderá todos os seus seguidores.
                        Esta ação não pode ser desfeita automaticamente e você precisará preencher o formulário novamente.
                      </p>
                      
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={onCancelMasterTrader}
                      >
                        Deixar de Ser Master Trader
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterTraderDashboard;
