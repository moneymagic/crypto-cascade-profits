
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Dados fictícios de ganhos
const earnings = [
  {
    id: "e1",
    type: "copy_trading",
    amount: 345.28,
    date: "2025-05-20T14:30:00Z",
    status: "paid",
    trader: "Carlos Almeida",
    strategy: "BTC/ETH Swing"
  },
  {
    id: "e2",
    type: "referral_bonus",
    amount: 42.75,
    date: "2025-05-18T09:15:00Z",
    status: "paid",
    level: 1,
    user: "João Silva"
  },
  {
    id: "e3",
    type: "copy_trading",
    amount: 198.50,
    date: "2025-05-15T11:20:00Z",
    status: "paid",
    trader: "Márcia Oliveira",
    strategy: "DeFi Yield"
  },
  {
    id: "e4",
    type: "referral_bonus",
    amount: 12.30,
    date: "2025-05-10T16:45:00Z",
    status: "paid",
    level: 2,
    user: "Ricardo Gomes"
  },
  {
    id: "e5",
    type: "copy_trading",
    amount: 85.15,
    date: "2025-05-05T10:10:00Z",
    status: "paid",
    trader: "Carlos Almeida",
    strategy: "BTC/ETH Swing"
  }
];

// Função para formatar data
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Dashboard de ganhos
const Earnings = () => {
  // Calcular totais
  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
  const copyTradingEarnings = earnings
    .filter(earning => earning.type === "copy_trading")
    .reduce((sum, earning) => sum + earning.amount, 0);
  const referralEarnings = earnings
    .filter(earning => earning.type === "referral_bonus")
    .reduce((sum, earning) => sum + earning.amount, 0);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Seus Ganhos</h1>
        <p className="text-muted-foreground">
          Acompanhe todos os seus ganhos com operações de copy trading e bônus de referidos.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total de Ganhos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-crypto-green">
                ${totalEarnings.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Últimos 30 dias</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ganhos com Copy Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-crypto-green">
                ${copyTradingEarnings.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Últimos 30 dias</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ganhos com Referidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-crypto-green">
                ${referralEarnings.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Últimos 30 dias</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Ganhos</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="copy_trading">Copy Trading</TabsTrigger>
                <TabsTrigger value="referral">Referidos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Data</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Detalhes</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Valor</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {earnings.map((earning) => (
                        <tr key={earning.id}>
                          <td className="px-4 py-3 text-sm">{formatDate(earning.date)}</td>
                          <td className="px-4 py-3 text-sm">
                            {earning.type === "copy_trading" ? "Copy Trading" : "Bônus Referido"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {earning.type === "copy_trading" 
                              ? `${earning.trader} - ${earning.strategy}`
                              : `Nível ${earning.level} - ${earning.user}`
                            }
                          </td>
                          <td className="px-4 py-3 text-sm text-crypto-green">
                            +${earning.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-crypto-green/20 text-crypto-green">
                              Recebido
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button variant="outline">Carregar Mais</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="copy_trading">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Data</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Trader</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Estratégia</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Valor</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {earnings
                        .filter(e => e.type === "copy_trading")
                        .map((earning) => (
                          <tr key={earning.id}>
                            <td className="px-4 py-3 text-sm">{formatDate(earning.date)}</td>
                            <td className="px-4 py-3 text-sm">{earning.trader}</td>
                            <td className="px-4 py-3 text-sm">{earning.strategy}</td>
                            <td className="px-4 py-3 text-sm text-crypto-green">
                              +${earning.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-crypto-green/20 text-crypto-green">
                                Recebido
                              </span>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="referral">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Data</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Usuário</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Nível</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Valor</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {earnings
                        .filter(e => e.type === "referral_bonus")
                        .map((earning) => (
                          <tr key={earning.id}>
                            <td className="px-4 py-3 text-sm">{formatDate(earning.date)}</td>
                            <td className="px-4 py-3 text-sm">{earning.user}</td>
                            <td className="px-4 py-3 text-sm">{earning.level}</td>
                            <td className="px-4 py-3 text-sm text-crypto-green">
                              +${earning.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-crypto-green/20 text-crypto-green">
                                Recebido
                              </span>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Earnings;
