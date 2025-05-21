
import { DashboardLayout } from "@/components/layout/Dashboard";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { MasterTradersList } from "@/components/dashboard/MasterTradersList";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <WelcomeCard />
        
        <div className="grid grid-cols-1 gap-6">
          <MasterTradersList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
