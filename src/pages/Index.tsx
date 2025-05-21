
import { DashboardLayout } from "@/components/layout/Dashboard";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { TradingOverview } from "@/components/dashboard/TradingOverview";
import { MasterTradersList } from "@/components/dashboard/MasterTradersList";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <WelcomeCard />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradingOverview />
          <MasterTradersList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
