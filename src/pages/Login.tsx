
import { LoginPage } from "@/components/auth/LoginPage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Verificar se o usuário já está autenticado
  useEffect(() => {
    if (user && !loading) {
      navigate("/traders");
    }
  }, [user, loading, navigate]);
  
  return <LoginPage />;
};

export default Login;
