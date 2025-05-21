
import { DashboardLayout } from "@/components/layout/Dashboard";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { MasterTradersList } from "@/components/dashboard/MasterTradersList";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Se o usuário não estiver autenticado e não estiver carregando,
    // redirecione para a página de login
    if (!user && !loading) {
      console.log("Index: Usuário não autenticado, redirecionando para /login");
      setIsRedirecting(true);
      navigate("/login");
    } else if (user) {
      console.log("Index: Usuário autenticado, redirecionando para /traders");
      // Sendo consistente com a aplicação, redirecionar para /traders quando estiver na página inicial
      navigate("/traders");
    }
  }, [user, loading, navigate]);

  // Se estiver carregando ou redirecionando, exibe um indicador
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            {isRedirecting ? "Redirecionando..." : "Carregando..."}
          </p>
        </div>
      </div>
    );
  }
  
  // Se não estiver autenticado, não renderiza o conteúdo
  if (!user) {
    console.log("Index: Renderização interrompida - usuário não autenticado");
    return null;
  }

  console.log("Index: Renderizando dashboard para usuário autenticado:", user);
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
