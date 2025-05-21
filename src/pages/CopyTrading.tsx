
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Lista de traders que o usuário está seguindo
const followedTraders = [
  {
    id: "1",
    name: "Carlos Almeida",
    avatar: "",
    winRate: "78%",
    profit30d: "+32.5%",
    positive: true,
    verified: true,
    specialization: "BTC/ETH",
    activeStrategies: 3,
    status: "active",
    allocationPercent: 25
  },
  {
    id: "4",
    name: "Márcia Oliveira",
    avatar: "",
    winRate: "81%",
    profit30d: "+41.2%",
    positive: true,
    verified: true,
    specialization: "DeFi",
    activeStrategies: 5,
    status: "active",
    allocationPercent: 30
  }
];

// Lista de operações copiadas recentes
const recentTrades = [
  {
    id: "t1",
    trader: "Carlos Almeida",
    pair: "BTC/USDT",
    type: "buy",
    entryPrice: 62450.00,
    currentPrice: 63100.00,
    amount: 0.15,
    status: "open",
    profit: "+4.18%",
    date: "2025-05-20T15:30:00Z"
  },
  {
    id: "t2",
    trader: "Márcia Oliveira",
    pair: "ETH/USDT",
    type: "sell",
    entryPrice: 3450.00,
    currentPrice: 3380.00,
    amount: 1.2,
    status: "open",
    profit: "+2.03%",
    date: "2025-05-21T09:15:00Z"
  },
  {
    id: "t3",
    trader: "Carlos Almeida",
    pair: "SOL/USDT",
    type: "buy",
    entryPrice: 145.20,
    currentPrice: 146.80,
    amount: 10,
    status: "closed",
    profit: "+1.10%",
    date: "2025-05-19T12:40:00Z"
  }
];

const CopyTrading = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Copy Trading</h1>
        <p className="text-muted-foreground">
          Gerencie suas estratégias de copy trading e acompanhe o desempenho dos traders que você segue.
        </p>
        
        <div className="bg-secondary/50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-sm text-muted-foreground">Saldo disponível</div>
              <div className="text-2xl font-bold">$12,480.00</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Alocado em copy trading</div>
              <div className="text-2xl font-bold">$5,500.00</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Lucro total (30d)</div>
              <div className="text-2xl font-bold text-crypto-green">+$840.25</div>
            </div>
          </div>
          <Button>Ajustar Alocação</Button>
        </div>
        
        <Tabs defaultValue="followed">
          <TabsList className="mb-6">
            <TabsTrigger value="followed">Traders Seguidos</TabsTrigger>
            <TabsTrigger value="trades">Operações Copiadas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="followed" className="space-y-4">
            {followedTraders.map(trader => (
              <Card key={trader.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={trader.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {trader.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {trader.name}
                          {trader.verified && (
                            <Badge variant="outline" className="border-crypto-blue text-crypto-blue">
                              Verificado
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {trader.specialization} • Win rate: {trader.winRate}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                      <div>
                        <div className="text-sm text-muted-foreground">Lucro 30d</div>
                        <div className={`font-medium ${trader.positive ? 'text-crypto-green' : 'text-crypto-red'}`}>
                          {trader.profit30d}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="font-medium flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-crypto-green"></span>
                          Ativo
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Estratégias</div>
                        <div className="font-medium">{trader.activeStrategies}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Alocação</div>
                        <div className="font-medium">{trader.allocationPercent}%</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Configurar</Button>
                      <Button variant="destructive" size="sm">Parar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="text-center pt-4">
              <Button variant="outline" className="w-full sm:w-auto">
                Adicionar Novo Trader
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="trades" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Par</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Trader</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Preço Entrada</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Preço Atual</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Quantidade</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Lucro</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentTrades.map((trade) => (
                    <tr key={trade.id}>
                      <td className="px-4 py-3 text-sm">{trade.pair}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'}>
                          {trade.type === 'buy' ? 'Compra' : 'Venda'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{trade.trader}</td>
                      <td className="px-4 py-3 text-sm">${trade.entryPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">${trade.currentPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">{trade.amount}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline" className={trade.status === 'open' ? 'border-crypto-blue text-crypto-blue' : ''}>
                          {trade.status === 'open' ? 'Aberta' : 'Fechada'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-crypto-green">
                        {trade.profit}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {trade.status === 'open' && (
                          <Button size="sm" variant="outline">Fechar</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CopyTrading;
