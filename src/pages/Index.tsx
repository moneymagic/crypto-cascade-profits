
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Index: Verificando autenticação", { user, loading });
    
    // Se não estiver carregando, decide para onde redirecionar
    if (!loading) {
      if (user) {
        console.log("Index: Usuário autenticado, redirecionando para /traders");
        navigate("/traders");
      } else {
        console.log("Index: Usuário não autenticado, redirecionando para /login");
        navigate("/login");
      }
    }
  }, [user, loading, navigate]);

  // Exibe um indicador de carregamento enquanto verifica a autenticação
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">
          Carregando...
        </p>
      </div>
    </div>
  );
};

export default Index;
