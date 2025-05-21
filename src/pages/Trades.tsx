
import { DashboardLayout } from "@/components/layout/Dashboard";

const Trades = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Histórico de Trades</h1>
        <p className="text-muted-foreground">
          Visualize seu histórico de operações em todas as contas conectadas.
        </p>
        
        {/* Conteúdo da página será implementado posteriormente */}
        <div className="p-6 bg-card rounded-lg border">
          <p className="text-center text-muted-foreground">
            O histórico de trades estará disponível em breve.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Trades;
