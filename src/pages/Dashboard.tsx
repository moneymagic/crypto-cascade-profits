import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Loader2, TrendingUp, Users, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DashboardStats {
  totalBalance: number;
  activeTraders: number;
  totalEarnings: number;
  networkSize: number;
  copyTradingProgress: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    activeTraders: 0,
    totalEarnings: 0,
    networkSize: 0,
    copyTradingProgress: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          return;
        }

        // Buscar saldo do usuário
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("balance, earnings")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
          return;
        }

        // Buscar contagem de traders ativos
        const { count: activeTraders, error: tradersError } = await supabase
          .from("traders")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");

        if (tradersError) {
          console.error("Erro ao buscar traders:", tradersError);
        }

        // Buscar tamanho da rede (referidos)
        const { count: networkSize, error: networkError } = await supabase
          .from("referrals")
          .select("*", { count: "exact", head: true })
          .eq("referrer_id", user.id);

        if (networkError) {
          console.error("Erro ao buscar rede:", networkError);
        }

        // Calcular progresso do copy trading (simulado)
        const copyTradingProgress = Math.min(
          Math.floor(Math.random() * 100),
          100
        );

        setStats({
          totalBalance: profileData?.balance || 0,
          activeTraders: activeTraders || 0,
          totalEarnings: profileData?.earnings || 0,
          networkSize: networkSize || 0,
          copyTradingProgress,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Carregando dados do dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Wallet className="h-4 w-4 text-primary mr-2" />
                <div className="text-2xl font-bold">
                  ${stats.totalBalance.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ganhos Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                <div className="text-2xl font-bold">
                  ${stats.totalEarnings.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Traders Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-500 mr-2" />
                <div className="text-2xl font-bold">{stats.activeTraders}</div>
              </div>
              <button 
                className="text-sm text-primary mt-2 hover:underline"
                onClick={() => navigate("/traders")}
              >
                Ver traders
              </button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tamanho da Rede
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-purple-500 mr-2" />
                <div className="text-2xl font-bold">{stats.networkSize}</div>
              </div>
              <button 
                className="text-sm text-primary mt-2 hover:underline"
                onClick={() => navigate("/network")}
              >
                Ver rede
              </button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Progresso do Copy Trading</CardTitle>
              <CardDescription>
                Acompanhe o desempenho do seu copy trading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progresso</span>
                  <span className="text-sm font-medium">{stats.copyTradingProgress}%</span>
                </div>
                <Progress value={stats.copyTradingProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Você está acompanhando {stats.activeTraders} traders ativos.
                </p>
                <button 
                  className="text-sm text-primary mt-2 hover:underline"
                  onClick={() => navigate("/copy-trading")}
                >
                  Gerenciar copy trading
                </button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Suas últimas transações e atividades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Depósito recebido</p>
                      <p className="text-sm text-muted-foreground">Há 2 dias</p>
                    </div>
                    <span className="text-green-500 font-medium">+$150.00</span>
                  </div>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Bônus de referência</p>
                      <p className="text-sm text-muted-foreground">Há 3 dias</p>
                    </div>
                    <span className="text-green-500 font-medium">+$25.00</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Ganho de copy trading</p>
                      <p className="text-sm text-muted-foreground">Há 5 dias</p>
                    </div>
                    <span className="text-green-500 font-medium">+$75.50</span>
                  </div>
                </div>
                <button 
                  className="text-sm text-primary mt-4 hover:underline"
                  onClick={() => navigate("/transactions")}
                >
                  Ver todas as transações
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
