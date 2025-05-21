
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, Profile } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Checar autenticação atual quando o componente é montado
    checkUser();

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (event === "SIGNED_IN" && session) {
          // Usuário logou, buscar perfil
          try {
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (error) {
              console.error("Erro ao buscar perfil:", error);
              throw error;
            }

            console.log("Perfil carregado:", profile);
            setUser(profile);
            setLoading(false);
          } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            setLoading(false);
          }
        } else if (event === "SIGNED_OUT") {
          // Usuário deslogou, limpar estado
          console.log("Usuário deslogado");
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      // Limpar listener quando o componente é desmontado
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  async function checkUser() {
    try {
      setLoading(true);
      
      // Verificar se já existe sessão
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log("Verificando sessão:", session?.user?.id);
      
      if (session) {
        // Buscar dados do perfil
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (error) {
          console.error("Erro ao buscar perfil na inicialização:", error);
          throw error;
        }
        
        console.log("Perfil carregado na inicialização:", profile);
        setUser(profile);
      } else {
        console.log("Nenhuma sessão ativa encontrada");
      }
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      console.log("Tentando fazer login com:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Verificar se o login foi bem-sucedido
      if (data.user) {
        console.log("Login bem-sucedido, obtendo perfil para:", data.user.id);
        
        // Buscar dados do perfil
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
          
        if (profileError) {
          console.error("Erro ao buscar perfil após login:", profileError);
          throw profileError;
        }
        
        // Atualizar estado com o perfil obtido
        console.log("Perfil obtido após login:", profile);
        setUser(profile);
        
        // Redirecionar e mostrar mensagem
        toast.success("Login realizado com sucesso!");
        navigate("/traders");
      } else {
        console.error("Login falhou: dados do usuário não encontrados");
        throw new Error("Falha ao fazer login. Tente novamente.");
      }
    } catch (error: any) {
      console.error("Erro de login:", error);
      toast.error("Erro ao fazer login", {
        description: error.message || "Verifique suas credenciais e tente novamente"
      });
      throw error;
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    try {
      // Criar novo usuário
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;

      // Criar registro na tabela de perfis
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            full_name: fullName,
            email: email,
            created_at: new Date().toISOString(),
            balance: 0,
          });
          
        if (profileError) throw profileError;
      }

      toast.success("Conta criada com sucesso!", {
        description: "Faça login para continuar."
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Erro de cadastro:", error);
      toast.error("Erro ao criar conta", {
        description: error.message || "Tente novamente com informações diferentes"
      });
      throw error;
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success("Você saiu da sua conta");
      navigate("/login");
    } catch (error: any) {
      console.error("Erro ao sair:", error);
      toast.error("Erro ao sair da conta", {
        description: error.message || "Tente novamente"
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
