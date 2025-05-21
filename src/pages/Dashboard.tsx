
import { DashboardLayout } from "@/components/layout/Dashboard";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { TradingOverview } from "@/components/dashboard/TradingOverview";
import { MasterTradersList } from "@/components/dashboard/MasterTradersList";
import { BonusNetwork } from "@/components/dashboard/BonusNetwork";
import { ExchangeConnections } from "@/components/dashboard/ExchangeConnections";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {user?.full_name || "Usuário"}. Confira seu desempenho e oportunidades.
          </p>
        </div>

        <WelcomeCard />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="traders">Traders</TabsTrigger>
            <TabsTrigger value="network">Rede</TabsTrigger>
            <TabsTrigger value="connections">Conexões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <TradingOverview />
          </TabsContent>
          
          <TabsContent value="traders" className="space-y-6">
            <MasterTradersList />
          </TabsContent>
          
          <TabsContent value="network" className="space-y-6">
            <BonusNetwork />
          </TabsContent>
          
          <TabsContent value="connections" className="space-y-6">
            <ExchangeConnections />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
