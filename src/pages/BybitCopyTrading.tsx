
import { DashboardLayout } from "@/components/layout/Dashboard";
import LiveTradingSystem from "@/components/bybit/LiveTradingSystem";

const BybitCopyTrading = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Bybit Copy Trading</h1>
        <p className="text-muted-foreground">
          Conecte suas contas Bybit e replique automaticamente as operações da conta master para a conta seguidora.
        </p>
        
        <LiveTradingSystem />
      </div>
    </DashboardLayout>
  );
};

export default BybitCopyTrading;
