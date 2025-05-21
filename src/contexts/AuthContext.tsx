
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
    // Se o cliente Supabase não estiver inicializado, não faz sentido continuar
    if (!supabase) {
      setLoading(false);
      toast.error("Erro de conexão com Supabase. Verifique as variáveis de ambiente.", {
        duration: 10000,
      });
      return;
    }

    // Checar autenticação atual quando o componente é montado
    checkUser();

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Usuário logou, buscar perfil
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            setUser(profile);
            setLoading(false);
          } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            setLoading(false);
          }
        } else if (event === "SIGNED_OUT") {
          // Usuário deslogou, limpar estado
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
    if (!supabase) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Verificar se já existe sessão
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Buscar dados do perfil
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        setUser(profile);
      }
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    if (!supabase) {
      toast.error("Supabase não está configurado. Verifique variáveis de ambiente.");
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      toast.success("Login realizado com sucesso!");
      navigate("/traders");
    } catch (error: any) {
      console.error("Erro de login:", error);
      toast.error(error.message || "Erro ao fazer login");
      throw error;
    }
  }

  async function signUp(email: string, password: string, fullName: string) {
    if (!supabase) {
      toast.error("Supabase não está configurado. Verifique variáveis de ambiente.");
      return;
    }
    
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

      toast.success("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (error: any) {
      console.error("Erro de cadastro:", error);
      toast.error(error.message || "Erro ao criar conta");
      throw error;
    }
  }

  async function signOut() {
    if (!supabase) {
      toast.error("Supabase não está configurado. Verifique variáveis de ambiente.");
      return;
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success("Você saiu da sua conta");
      navigate("/login");
    } catch (error: any) {
      console.error("Erro ao sair:", error);
      toast.error(error.message || "Erro ao sair da conta");
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
