
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getEarnings, getTotalEarnings } from "@/lib/database";
import { toast } from "@/components/ui/use-toast";

interface EarningType {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  trader_id: string | null;
  strategy: string | null;
  level: number | null;
  rank: string | null;
  referred_user: string | null;
  user_rank: string | null;
  difference_rate: string | null;
  followers: number | null;
}

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
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<EarningType[]>([]);
  const [totalEarnings, setTotalEarnings] = useState({
    total: 0,
    copyTrading: 0,
    referral: 0,
    master: 0
  });

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Carregar ganhos
        const earningsData = await getEarnings(user.id);
        setEarnings(earningsData);
        
        // Carregar totais
        const totals = await getTotalEarnings(user.id);
        setTotalEarnings(totals);
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível obter as informações de ganhos.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Seus Ganhos</h1>
        <p className="text-muted-foreground">
          Acompanhe todos os seus ganhos com operações de copy trading e bônus de referidos.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total de Ganhos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-crypto-green">
                ${totalEarnings.total.toFixed(2)}
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
                ${totalEarnings.copyTrading.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">70% do lucro</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ganhos como Master</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-crypto-green">
                ${totalEarnings.master.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">10% da comissão</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ganhos com Referidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-crypto-green">
                ${totalEarnings.referral.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Sistema multinível</div>
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
                <TabsTrigger value="master">Como Master</TabsTrigger>
                <TabsTrigger value="referral">Referidos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {loading ? (
                  <div className="text-center py-8">Carregando ganhos...</div>
                ) : earnings.length > 0 ? (
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
                              {earning.type === "copy_trading" 
                                ? "Copy Trading" 
                                : earning.type === "referral_bonus"
                                  ? "Bônus Referido"
                                  : "Bônus Master"
                              }
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {earning.type === "copy_trading" && earning.strategy
                                ? `${earning.strategy}`
                                : earning.type === "referral_bonus" && earning.referred_user && earning.user_rank && earning.level && earning.difference_rate
                                  ? `${earning.referred_user} (${earning.user_rank}) - Nível ${earning.level} - Diferença ${earning.difference_rate}`
                                  : earning.followers && earning.strategy
                                    ? `${earning.followers} seguidores - ${earning.strategy}`
                                    : "Sem detalhes"
                              }
                            </td>
                            <td className="px-4 py-3 text-sm text-crypto-green">
                              +${earning.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-crypto-green/20 text-crypto-green">
                                {earning.status === "paid" ? "Recebido" : "Pendente"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="mt-6 flex justify-center">
                      <Button variant="outline">Carregar Mais</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Você ainda não tem registros de ganhos.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="copy_trading">
                {loading ? (
                  <div className="text-center py-8">Carregando ganhos...</div>
                ) : earnings.filter(e => e.type === "copy_trading").length > 0 ? (
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
                              <td className="px-4 py-3 text-sm">{earning.trader_id || "N/A"}</td>
                              <td className="px-4 py-3 text-sm">{earning.strategy || "N/A"}</td>
                              <td className="px-4 py-3 text-sm text-crypto-green">
                                +${earning.amount.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-crypto-green/20 text-crypto-green">
                                  {earning.status === "paid" ? "Recebido" : "Pendente"}
                                </span>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Você ainda não tem ganhos de Copy Trading.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="master">
                {loading ? (
                  <div className="text-center py-8">Carregando ganhos...</div>
                ) : earnings.filter(e => e.type === "master_bonus").length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Data</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Seguidores</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Estratégia</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Valor</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {earnings
                          .filter(e => e.type === "master_bonus")
                          .map((earning) => (
                            <tr key={earning.id}>
                              <td className="px-4 py-3 text-sm">{formatDate(earning.date)}</td>
                              <td className="px-4 py-3 text-sm">{earning.followers || 0}</td>
                              <td className="px-4 py-3 text-sm">{earning.strategy || "N/A"}</td>
                              <td className="px-4 py-3 text-sm text-crypto-green">
                                +${earning.amount.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-crypto-green/20 text-crypto-green">
                                  {earning.status === "paid" ? "Recebido" : "Pendente"}
                                </span>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Você ainda não tem ganhos como Master.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="referral">
                {loading ? (
                  <div className="text-center py-8">Carregando ganhos...</div>
                ) : earnings.filter(e => e.type === "referral_bonus").length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Data</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Usuário</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Ranking</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Nível</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Diferença</th>
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
                              <td className="px-4 py-3 text-sm">{earning.referred_user || "N/A"}</td>
                              <td className="px-4 py-3 text-sm">{earning.user_rank || "N/A"}</td>
                              <td className="px-4 py-3 text-sm">{earning.level || "N/A"}</td>
                              <td className="px-4 py-3 text-sm">{earning.difference_rate || "N/A"}</td>
                              <td className="px-4 py-3 text-sm text-crypto-green">
                                +${earning.amount.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-crypto-green/20 text-crypto-green">
                                  {earning.status === "paid" ? "Recebido" : "Pendente"}
                                </span>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Você ainda não tem ganhos de Referidos.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Earnings;
