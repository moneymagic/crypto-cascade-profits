
import { DashboardLayout } from "@/components/layout/Dashboard";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { MasterTradersList } from "@/components/dashboard/MasterTradersList";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário não estiver autenticado e não estiver carregando,
    // redirecione para a página de login
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Se estiver carregando, exibe um indicador de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Se não estiver autenticado, não renderiza o conteúdo
  if (!user) return null;

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
