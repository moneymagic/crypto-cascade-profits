
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile } from "@/lib/supabase";
import { getFollowedTraders, getTrades } from "@/lib/database";
import { toast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";
import { useBybitTrading } from "@/hooks/useBybitTrading";

interface TraderType {
  id: string;
  trader: {
    id: string;
    name: string;
    avatar_url: string | null;
    win_rate: string;
    profit_30d: string;
    positive: boolean;
    verified: boolean;
    specialization: string;
    description: string;
  };
  allocation_percent: number;
}

interface TradeType {
  id: string;
  trader: {
    name: string;
  };
  pair: string;
  type: string;
  entry_price: number;
  current_price: number;
  amount: number;
  status: string;
  profit: string;
  date: string;
}

const CopyTrading = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [followedTraders, setFollowedTraders] = useState<TraderType[]>([]);
  const [recentTrades, setRecentTrades] = useState<TradeType[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [allocatedBalance, setAllocatedBalance] = useState(0);
  const [profitBalance, setProfitBalance] = useState(0);
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);
  
  // Obter o saldo da conta Bybit usando o hook useBybitTrading
  const { masterBalance, followerBalance, fetchBalances } = useBybitTrading();
  const bybitBalance = (masterBalance || 0) + (followerBalance || 0);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Carregar dados do perfil do usuário
      const profile = await getProfile();
      if (profile) {
        setUserBalance(profile.balance || 0);
      }
      
      // Carregar traders seguidos
      const followedData = await getFollowedTraders(user.id);
      setFollowedTraders(followedData);
      
      // Calcular saldo alocado (30% do saldo total para este exemplo)
      const allocated = profile?.balance ? profile.balance * 0.3 : 0;
      setAllocatedBalance(allocated);
      
      // Calcular lucro fictício para demonstração (em uma implementação real viria do banco)
      setProfitBalance(allocated * 0.15);
      
      // Carregar operações
      const tradesData = await getTrades(user.id);
      setRecentTrades(tradesData);
      
      // Buscar saldos das contas Bybit
      await fetchBalances();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível obter as informações de copy trading.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdateBalances = async () => {
    setIsUpdatingBalance(true);
    try {
      // Buscar saldos das contas Bybit
      await fetchBalances();
      await loadData();
      toast({
        title: "Saldos atualizados",
        description: "Informações de saldo atualizadas com sucesso."
      });
    } catch (error) {
      console.error("Erro ao atualizar saldos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os saldos.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingBalance(false);
    }
  };

  const handleStopFollowing = async (traderId: string) => {
    try {
      // Em uma implementação real, chamaríamos a API para parar de seguir o trader
      toast({
        title: "Trader removido",
        description: "Você parou de seguir este trader com sucesso."
      });
    } catch (error) {
      console.error("Erro ao parar de seguir trader:", error);
      toast({
        title: "Erro",
        description: "Não foi possível parar de seguir este trader.",
        variant: "destructive"
      });
    }
  };

  const handleCloseTrade = async (tradeId: string) => {
    try {
      // Em uma implementação real, chamaríamos a API para fechar a operação
      toast({
        title: "Operação fechada",
        description: "A operação foi fechada com sucesso."
      });
    } catch (error) {
      console.error("Erro ao fechar operação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível fechar esta operação.",
        variant: "destructive"
      });
    }
  };

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
              <div className="text-2xl font-bold">${userBalance.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Alocado em copy trading</div>
              <div className="text-2xl font-bold">${allocatedBalance.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Lucro total (30d)</div>
              <div className="text-2xl font-bold text-crypto-green">+${profitBalance.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="border border-border bg-background rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Saldo Bybit Disponível</h3>
                <div className="text-2xl font-bold text-vastcopy-teal mt-1">${bybitBalance.toFixed(2)} USDT</div>
                {masterBalance !== null && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Master: ${masterBalance.toFixed(2)} • Follower: ${followerBalance ? followerBalance.toFixed(2) : "0.00"}
                  </div>
                )}
              </div>
              <Button 
                onClick={handleUpdateBalances}
                disabled={isUpdatingBalance}
                className="gap-2 bg-vastcopy-teal hover:bg-vastcopy-teal/90"
              >
                <RefreshCw size={16} className={isUpdatingBalance ? "animate-spin" : ""} />
                {isUpdatingBalance ? "Atualizando..." : "Atualizar Saldos"}
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="followed">
          <TabsList className="mb-6">
            <TabsTrigger value="followed">Traders Seguidos</TabsTrigger>
            <TabsTrigger value="trades">Operações Copiadas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="followed" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Carregando traders...</div>
            ) : followedTraders.length > 0 ? (
              followedTraders.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={item.trader.avatar_url || ''} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {item.trader.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {item.trader.name}
                            {item.trader.verified && (
                              <Badge variant="outline" className="border-crypto-blue text-crypto-blue">
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.trader.specialization} • Win rate: {item.trader.win_rate}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                        <div>
                          <div className="text-sm text-muted-foreground">Lucro 30d</div>
                          <div className={`font-medium ${item.trader.positive ? 'text-crypto-green' : 'text-crypto-red'}`}>
                            {item.trader.profit_30d}
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
                          <div className="font-medium">3</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Alocação</div>
                          <div className="font-medium">{item.allocation_percent}%</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Configurar</Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleStopFollowing(item.id)}
                        >
                          Parar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Você ainda não está seguindo nenhum trader.
              </div>
            )}
            
            <div className="text-center pt-4">
              <Button variant="outline" className="w-full sm:w-auto">
                Adicionar Novo Trader
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="trades" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Carregando operações...</div>
            ) : recentTrades.length > 0 ? (
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
                        <td className="px-4 py-3 text-sm">{trade.trader.name}</td>
                        <td className="px-4 py-3 text-sm">${trade.entry_price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">${trade.current_price.toFixed(2)}</td>
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
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleCloseTrade(trade.id)}
                            >
                              Fechar
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Você ainda não tem operações copiadas.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CopyTrading;
