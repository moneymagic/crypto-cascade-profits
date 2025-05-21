
import { DashboardLayout } from "@/components/layout/Dashboard";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { TradingOverview } from "@/components/dashboard/TradingOverview";
import { MasterTradersList } from "@/components/dashboard/MasterTradersList";
import { BonusNetwork } from "@/components/dashboard/BonusNetwork";
import { ExchangeConnections } from "@/components/dashboard/ExchangeConnections";
import TestingEnvironment from "@/components/testing/TestingEnvironment";
import LiveTradingSystem from "@/components/bybit/LiveTradingSystem";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <LiveTradingSystem />
        
        <TestingEnvironment />
        
        <WelcomeCard />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradingOverview />
          <MasterTradersList />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BonusNetwork />
          <ExchangeConnections />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
