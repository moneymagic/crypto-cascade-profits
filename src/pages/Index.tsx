
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const [destination, setDestination] = useState("");
  const [message, setMessage] = useState("Verificando autenticação...");
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    console.log("Index: Verificando autenticação", { user, loading });
    
    // Se não estiver carregando, decide para onde redirecionar
    if (!loading) {
      if (user) {
        setRedirecting(true);
        setDestination("/traders");
        setMessage("Autenticação confirmada! Redirecionando para área restrita...");
        console.log("Index: Usuário autenticado, redirecionando para /traders");
        
        // Adiciona um pequeno delay para mostrar a informação de redirecionamento
        setTimeout(() => {
          navigate("/traders");
        }, 1000);
      } else {
        // Vamos verificar se há um token na URL (caso o usuário venha de um email de confirmação)
        const url = new URL(window.location.href);
        const accessToken = url.searchParams.get("access_token");
        
        if (accessToken) {
          // Se houver um token de acesso na URL, espere mais tempo
          setMessage("Processando autenticação...");
          setTimeout(() => {
            setRedirecting(true);
            setDestination("/login");
            setMessage("Redirecionando para o login...");
            navigate("/login");
          }, 3000);
        } else {
          setRedirecting(true);
          setDestination("/login");
          setMessage("Você não está autenticado. Redirecionando para o login...");
          console.log("Index: Usuário não autenticado, redirecionando para /login");
          
          // Adiciona um pequeno delay para mostrar a informação de redirecionamento
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        }
      }
    }
  }, [user, loading, navigate]);

  // Manual retry option when there might be authentication issues
  const handleRetryLogin = () => {
    navigate("/login");
  };

  // Exibe um indicador de carregamento enquanto verifica a autenticação
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">
          {loading ? "Carregando..." : message}
        </p>
        {redirecting && (
          <p className="mt-2 text-sm text-muted-foreground">
            Destino: {destination}
          </p>
        )}
        
        {authError && (
          <div className="mt-6">
            <p className="text-red-500 mb-2">Houve um problema com a autenticação.</p>
            <Button onClick={handleRetryLogin}>Tentar login novamente</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
