
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    console.log("Index: Verificando autenticação", { user, loading });
    
    // Se não estiver carregando, decide para onde redirecionar
    if (!loading) {
      setRedirecting(true);
      
      if (user) {
        setDestination("/traders");
        console.log("Index: Usuário autenticado, redirecionando para /traders");
        
        // Adiciona um pequeno delay para mostrar a informação de redirecionamento
        setTimeout(() => {
          navigate("/traders");
        }, 800);
      } else {
        setDestination("/login");
        console.log("Index: Usuário não autenticado, redirecionando para /login");
        
        // Adiciona um pequeno delay para mostrar a informação de redirecionamento
        setTimeout(() => {
          navigate("/login");
        }, 800);
      }
    }
  }, [user, loading, navigate]);

  // Exibe um indicador de carregamento enquanto verifica a autenticação
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">
          {loading ? "Carregando..." : redirecting ? `Redirecionando para ${destination}...` : "Verificando..."}
        </p>
      </div>
    </div>
  );
};

export default Index;
