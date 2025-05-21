
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  const [destination, setDestination] = useState("");
  const [message, setMessage] = useState("Verificando autenticação...");
  const [authError, setAuthError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.log("Index: Verificando autenticação", { user, loading });
    
    // Se não estiver carregando, decide para onde redirecionar
    if (!loading) {
      if (user) {
        setRedirecting(true);
        setDestination("/traders");
        setMessage("Autenticação confirmada! Redirecionando para área restrita...");
        console.log("Index: Usuário autenticado, redirecionando para /traders");
        
        // Limpar qualquer estado de erro anterior
        setAuthError(false);
        
        // Adiciona um pequeno delay para mostrar a informação de redirecionamento
        setTimeout(() => {
          navigate("/traders");
        }, 1000);
      } else {
        // Se não há um usuário autenticado e já tentamos várias vezes, mostramos uma mensagem de erro
        if (retryCount > 2) {
          setAuthError(true);
          setMessage("Não foi possível verificar sua autenticação. Por favor, faça login novamente.");
          return;
        }
        
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
          // Incrementar o contador de tentativas
          setRetryCount(prev => prev + 1);
          
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
  }, [user, loading, navigate, retryCount]);

  // Manual retry option when there might be authentication issues
  const handleRetryLogin = () => {
    toast.info("Redirecionando para a página de login");
    navigate("/login");
  };

  // Exibe um indicador de carregamento enquanto verifica a autenticação
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {loading ? (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        ) : authError ? (
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
        ) : (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        )}
        
        <p className="mt-4 text-muted-foreground">
          {loading ? "Carregando..." : message}
        </p>
        {redirecting && !authError && (
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
