
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VastCopyLogo } from "@/components/logo/VastCopyLogo";
import { LoginForm } from "./LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Se o usuário já está autenticado, redireciona para a página principal
  useEffect(() => {
    if (user && !loading) {
      console.log("LoginPage: Usuário já autenticado, redirecionando para /traders");
      navigate("/traders");
    }
  }, [user, loading, navigate]);

  // Se estiver carregando, mostra um indicador de loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <VastCopyLogo className="mx-auto h-12 w-auto mb-4" />
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mt-4"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, mostra o formulário de login
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <VastCopyLogo className="mx-auto h-12 w-auto mb-4" />
          <h1 className="text-2xl font-bold">VastCopy</h1>
          <p className="text-muted-foreground">Entre na sua conta para continuar</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Não tem uma conta?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
