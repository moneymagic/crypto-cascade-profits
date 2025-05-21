
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Wallet as WalletIcon, ArrowDown, ArrowUp, CreditCard, Info, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import AccountBalances from "@/components/bybit/AccountBalances";
import { toast } from "@/components/ui/use-toast";

// Dados de exemplo para transações
const transactions = [
  {
    id: "tx1",
    type: "deposit",
    amount: 500.00,
    currency: "USDT",
    status: "completed",
    date: "2025-05-17T14:20:00Z",
    description: "Depósito de Gas Fee"
  },
  {
    id: "tx2",
    type: "fee",
    amount: 45.20,
    currency: "USDT",
    status: "completed",
    date: "2025-05-20T09:15:00Z",
    description: "Taxa de Copy Trading - Semana 20"
  },
  {
    id: "tx3",
    type: "profit",
    amount: 210.50,
    currency: "USDT",
    status: "pending",
    date: "2025-05-21T00:00:00Z",
    description: "Lucro retido aguardando liquidação"
  },
  {
    id: "tx4",
    type: "network",
    amount: 125.30,
    currency: "USDT",
    status: "completed",
    date: "2025-05-19T18:30:00Z",
    description: "Bônus de Rede - Nível V3"
  }
];

const Wallet = () => {
  const [activeTab, setActiveTab] = useState("platform");
  
  const handleRefreshBybitBalance = () => {
    toast({
      title: "Atualizando saldos",
      description: "Buscando informações atualizadas das contas Bybit..."
    });
    
    // Aqui implementaríamos a atualização real dos saldos via API
    setTimeout(() => {
      toast({
        title: "Saldos atualizados",
        description: "As informações das contas Bybit foram atualizadas com sucesso."
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Carteira</h1>
            <p className="text-muted-foreground">
              Gerencie seu saldo, taxas e transações
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4" />
              Retirar
            </Button>
            <Button className="flex items-center gap-2 bg-vastcopy-teal hover:bg-vastcopy-teal/90">
              <ArrowDown className="h-4 w-4" />
              Depositar
            </Button>
          </div>
        </div>
        
        {/* Abas para alternar entre saldo da plataforma e saldo Bybit */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="platform">Saldo na VastCopy</TabsTrigger>
            <TabsTrigger value="bybit">Saldo Bybit Unified</TabsTrigger>
          </TabsList>
          
          <TabsContent value="platform" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Saldo Disponível</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$1,245.00</div>
                  <p className="text-sm text-muted-foreground mt-1">Última atualização: 21 Maio, 2025</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Saldo Retido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$454.80</div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uso atual</span>
                      <span>45% (Semanal)</span>
                    </div>
                    <Progress value={45} className="h-2 bg-muted" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ganhos da Rede</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-vastcopy-blue">$325.80</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Ganhos acumulados
                    </Badge>
                    <span className="text-sm text-muted-foreground">Último: 19 Mai</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="bybit" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Saldos Bybit Trading</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshBybitBalance}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Atualizar
                </Button>
              </CardHeader>
              <CardContent>
                <AccountBalances 
                  masterBalance={875.20} 
                  followerBalance={520.45} 
                />
                
                <div className="bg-muted/50 p-4 rounded-lg flex gap-3 items-start mt-6">
                  <Info className="h-5 w-5 text-vastcopy-blue mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Sobre os Saldos Bybit</h4>
                    <p className="text-sm text-muted-foreground">
                      Estes são os saldos disponíveis nas suas contas Bybit Unified Trading. 
                      Esses valores são usados diretamente para operações de copy trading e 
                      são gerenciados pela Bybit. Depósitos e saques devem ser feitos diretamente 
                      na plataforma Bybit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Lucros Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-vastcopy-teal">$210.50</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Aguardando liquidação</Badge>
                  <span className="text-sm text-muted-foreground">Próxima: Dom, 25 Mai</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações de Saldo Retido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-4 rounded-lg flex gap-3 items-start">
              <Info className="h-5 w-5 text-vastcopy-blue mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Como funciona o Saldo Retido</h4>
                <p className="text-sm text-muted-foreground">
                  O Saldo Retido é uma quantia pré-paga que é utilizada para cobrir as taxas de copy trading. 
                  Quando um trader que você segue gera lucro, uma porcentagem é retida como taxa até o final da semana. 
                  Se o trader tiver prejuízo após ter lucro, o valor retido é devolvido proporcionalmente. 
                  As taxas são liquidadas semanalmente, aos domingos.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-medium mb-3">Saldo Retido por Trader</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex gap-2">
                      <div className="h-9 w-9 rounded-full bg-vastcopy-teal/20 flex items-center justify-center">
                        <span className="font-medium text-vastcopy-teal">CA</span>
                      </div>
                      <div>
                        <div className="font-medium">Carlos Almeida</div>
                        <div className="text-xs text-muted-foreground">25% de alocação</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$125.00</div>
                      <div className="text-xs text-muted-foreground">Saldo retido</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex gap-2">
                      <div className="h-9 w-9 rounded-full bg-vastcopy-blue/20 flex items-center justify-center">
                        <span className="font-medium text-vastcopy-blue">MO</span>
                      </div>
                      <div>
                        <div className="font-medium">Márcia Oliveira</div>
                        <div className="text-xs text-muted-foreground">30% de alocação</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$150.00</div>
                      <div className="text-xs text-muted-foreground">Saldo retido</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Saldo Retido Recomendado</h3>
                <Card className="bg-gradient-to-br from-vastcopy-navy/95 to-vastcopy-blue/95 border-0 text-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-lg font-medium">Valor Recomendado</div>
                      <div className="text-2xl font-bold">$750.00</div>
                    </div>
                    <p className="text-sm text-white/80 mb-4">
                      Com base no seu volume atual de copy trading e número de traders seguidos,
                      recomendamos manter este valor em saldo retido para operações sem interrupções.
                    </p>
                    <Button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Ajustar Saldo Retido
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="w-full">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-center justify-between">
              <CardTitle>Histórico de Transações</CardTitle>
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="deposits">Depósitos</TabsTrigger>
                <TabsTrigger value="fees">Taxas</TabsTrigger>
                <TabsTrigger value="profits">Lucros</TabsTrigger>
                <TabsTrigger value="network">Rede</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          
          <TabsContent value="all">
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Descrição</th>
                        <th className="text-left py-3 px-4 font-medium">Data</th>
                        <th className="text-left py-3 px-4 font-medium">Valor</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center
                                ${tx.type === 'deposit' ? 'bg-vastcopy-teal/20' : 
                                  tx.type === 'fee' ? 'bg-vastcopy-navy/20' : 
                                  tx.type === 'profit' ? 'bg-vastcopy-blue/20' :
                                  'bg-green-100'}`}>
                                {tx.type === 'deposit' && <ArrowDown className="h-4 w-4 text-vastcopy-teal" />}
                                {tx.type === 'fee' && <WalletIcon className="h-4 w-4 text-vastcopy-navy" />}
                                {tx.type === 'profit' && <ArrowUp className="h-4 w-4 text-vastcopy-blue" />}
                                {tx.type === 'network' && <WalletIcon className="h-4 w-4 text-green-600" />}
                              </div>
                              <div>
                                <div className="font-medium">{tx.description}</div>
                                <div className="text-xs text-muted-foreground">
                                  {tx.type === 'deposit' ? 'Depósito' : 
                                    tx.type === 'fee' ? 'Taxa' : 
                                    tx.type === 'profit' ? 'Lucro' :
                                    'Bônus de Rede'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(tx.date).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <div className={`font-medium
                              ${tx.type === 'deposit' ? 'text-vastcopy-teal' : 
                                tx.type === 'fee' ? 'text-vastcopy-navy' : 
                                tx.type === 'profit' ? 'text-vastcopy-blue' :
                                'text-green-600'}`}>
                              {tx.type === 'deposit' ? '+' : tx.type === 'fee' ? '-' : '+'} 
                              ${tx.amount.toFixed(2)} {tx.currency}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={`
                                ${tx.status === 'completed' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                }
                              `}
                            >
                              {tx.status === 'completed' ? 'Concluído' : 'Pendente'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deposits">
            {/* Conteúdo filtrado para depósitos */}
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Descrição</th>
                        <th className="text-left py-3 px-4 font-medium">Data</th>
                        <th className="text-left py-3 px-4 font-medium">Valor</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions
                        .filter(tx => tx.type === 'deposit')
                        .map((tx) => (
                          <tr key={tx.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-vastcopy-teal/20 flex items-center justify-center">
                                  <ArrowDown className="h-4 w-4 text-vastcopy-teal" />
                                </div>
                                <div>
                                  <div className="font-medium">{tx.description}</div>
                                  <div className="text-xs text-muted-foreground">Depósito</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {new Date(tx.date).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-vastcopy-teal">
                                +${tx.amount.toFixed(2)} {tx.currency}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-200"
                              >
                                Concluído
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fees">
            {/* Conteúdo para taxas */}
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Descrição</th>
                        <th className="text-left py-3 px-4 font-medium">Data</th>
                        <th className="text-left py-3 px-4 font-medium">Valor</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions
                        .filter(tx => tx.type === 'fee')
                        .map((tx) => (
                          <tr key={tx.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-vastcopy-navy/20 flex items-center justify-center">
                                  <WalletIcon className="h-4 w-4 text-vastcopy-navy" />
                                </div>
                                <div>
                                  <div className="font-medium">{tx.description}</div>
                                  <div className="text-xs text-muted-foreground">Taxa</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {new Date(tx.date).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-vastcopy-navy">
                                -${tx.amount.toFixed(2)} {tx.currency}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-200"
                              >
                                Concluído
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profits">
            {/* Conteúdo para lucros */}
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Descrição</th>
                        <th className="text-left py-3 px-4 font-medium">Data</th>
                        <th className="text-left py-3 px-4 font-medium">Valor</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions
                        .filter(tx => tx.type === 'profit')
                        .map((tx) => (
                          <tr key={tx.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-vastcopy-blue/20 flex items-center justify-center">
                                  <ArrowUp className="h-4 w-4 text-vastcopy-blue" />
                                </div>
                                <div>
                                  <div className="font-medium">{tx.description}</div>
                                  <div className="text-xs text-muted-foreground">Lucro</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {new Date(tx.date).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-vastcopy-blue">
                                +${tx.amount.toFixed(2)} {tx.currency}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="outline"
                                className="bg-yellow-100 text-yellow-800 border-yellow-200"
                              >
                                Pendente
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="network">
            {/* Conteúdo para ganhos de rede */}
            <Card>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Descrição</th>
                        <th className="text-left py-3 px-4 font-medium">Data</th>
                        <th className="text-left py-3 px-4 font-medium">Valor</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions
                        .filter(tx => tx.type === 'network')
                        .map((tx) => (
                          <tr key={tx.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                  <WalletIcon className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{tx.description}</div>
                                  <div className="text-xs text-muted-foreground">Bônus de Rede</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {new Date(tx.date).toLocaleDateString('pt-BR', { 
                                day: '2-digit', 
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-green-600">
                                +${tx.amount.toFixed(2)} {tx.currency}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 border-green-200"
                              >
                                Concluído
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;
