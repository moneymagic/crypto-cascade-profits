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
            console.log("Buscando perfil após evento SIGNED_IN para usuário:", session.user.id);
            
            // Usar Promise.race para adicionar timeout na busca do perfil
            const profilePromise = supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
              
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error("Tempo esgotado ao buscar perfil")), 3000);
            });
            
            const { data: profile, error } = await Promise.race([
              profilePromise,
              timeoutPromise
            ]) as any;

            if (error) {
              console.error("Erro ao buscar perfil após evento:", error);
              throw error;
            }

            if (!profile) {
              console.error("Perfil não encontrado após evento de login para ID:", session.user.id);
              
              // Tentar criar um perfil básico automaticamente
              try {
                const { data: newProfile, error: createError } = await supabase
                  .from("profiles")
                  .insert({
                    id: session.user.id,
                    full_name: session.user.user_metadata?.full_name || "Usuário",
                    email: session.user.email,
                    created_at: new Date().toISOString(),
                    balance: 0,
                  })
                  .select()
                  .single();
                  
                if (createError) throw createError;
                
                console.log("Perfil criado automaticamente:", newProfile);
                setUser(newProfile);
              } catch (createError) {
                console.error("Erro ao criar perfil automaticamente:", createError);
                setUser(null);
              }
              
              setLoading(false);
              return;
            }

            console.log("Perfil carregado após evento de login:", profile);
            setUser(profile);
            setLoading(false);
            
            // Não redirecione automaticamente aqui - deixe o componente Login lidar com isso
            console.log("Usuário autenticado, aguardando componente Login redirecionar");
          } catch (error) {
            console.error("Erro ao carregar perfil após evento:", error);
            toast.error("Erro ao carregar seu perfil", {
              description: "Por favor, tente novamente"
            });
            setLoading(false);
          }
        } else if (event === "SIGNED_OUT") {
          // Usuário deslogou, limpar estado
          console.log("Usuário deslogado");
          setUser(null);
          setLoading(false);
          
          // Redirecionar para login
          console.log("Redirecionando para login após logout");
          navigate("/login");
        }
      }
    );

    return () => {
      // Limpar listener quando o componente é desmontado
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  async function checkUser() {
    try {
      setLoading(true);
      
      // Verificar se já existe sessão
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log("Verificando sessão inicial:", session?.user?.id);
      
      if (session) {
        // Buscar dados do perfil
        console.log("Buscando perfil para usuário com ID:", session.user.id);
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (error) {
          console.error("Erro ao buscar perfil na inicialização:", error);
          throw error;
        }
        
        if (!profile) {
          console.error("Perfil não encontrado na inicialização para ID:", session.user.id);
          // Criar um perfil básico para este usuário
          try {
            const { error: createError } = await supabase
              .from("profiles")
              .insert({
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || "Usuário",
                email: session.user.email,
                created_at: new Date().toISOString(),
                balance: 0,
              });
              
            if (createError) {
              throw createError;
            }
            
            // Buscar o perfil recém-criado
            const { data: newProfile, error: fetchError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
              
            if (fetchError || !newProfile) {
              throw fetchError || new Error("Falha ao buscar perfil recém-criado");
            }
            
            setUser(newProfile);
          } catch (createError) {
            console.error("Erro ao criar perfil:", createError);
            // Deslogar o usuário se não conseguir criar um perfil
            await supabase.auth.signOut();
            setUser(null);
          }
        } else {
          console.log("Perfil carregado na inicialização:", profile);
          setUser(profile);
        }
        
        // Verificar a rota atual
        console.log("Rota atual:", window.location.pathname);
        
        // Se o usuário está autenticado e estamos na página de login, redirecionar
        if (window.location.pathname === "/login") {
          console.log("Usuário já autenticado e está na página de login, redirecionando para /traders");
          navigate("/traders");
        }
      } else {
        console.log("Nenhuma sessão ativa encontrada");
        // Redirecionar para login se estiver em uma rota protegida
        const currentPath = window.location.pathname;
        console.log("Verificando se precisa redirecionar da rota:", currentPath);
        
        if (currentPath !== "/login" && currentPath !== "/register" && currentPath !== "/") {
          console.log("Rota protegida sem autenticação, redirecionando para /login");
          navigate("/login");
        }
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
      
      // Adicionar um timeout mais curto para a operação de login
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const timeoutPromise = new Promise<{data: any, error: any}>((_, reject) => {
        setTimeout(() => reject(new Error("Tempo esgotado durante o login")), 4000);
      });
      
      const { data, error } = await Promise.race([loginPromise, timeoutPromise]);
      
      if (error) {
        console.error("Erro retornado pelo supabase.auth.signInWithPassword:", error);
        throw error;
      }
      
      // Verificar se o login foi bem-sucedido
      if (!data || !data.user) {
        console.error("Login falhou: dados do usuário não encontrados");
        throw new Error("Falha ao fazer login. Tente novamente.");
      }
      
      console.log("Login bem-sucedido, obtendo perfil para:", data.user.id);
      
      // Buscar dados do perfil com timeout
      const profilePromise = supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
        
      const profileTimeoutPromise = new Promise<{data: any, error: any}>((_, reject) => {
        setTimeout(() => reject(new Error("Tempo esgotado ao buscar perfil")), 3000);
      });
      
      const { data: profile, error: profileError } = await Promise.race([
        profilePromise, 
        profileTimeoutPromise
      ]);
        
      if (profileError) {
        console.error("Erro ao buscar perfil após login:", profileError);
        
        // Se o perfil não foi encontrado, criar um
        if (profileError.code === "PGRST116") {
          console.log("Perfil não encontrado, criando perfil para:", data.user.id);
          
          const { error: createError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || "Usuário",
              email: email,
              created_at: new Date().toISOString(),
              balance: 0,
            });
            
          if (createError) {
            console.error("Erro ao criar perfil:", createError);
            throw createError;
          }
          
          // Buscar o perfil recém-criado
          const { data: newProfile, error: fetchError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
            
          if (fetchError) {
            console.error("Erro ao buscar perfil recém-criado:", fetchError);
            throw fetchError;
          }
          
          if (!newProfile) {
            console.error("Perfil recém-criado não encontrado");
            throw new Error("Perfil recém-criado não encontrado");
          }
          
          console.log("Perfil criado e obtido após login:", newProfile);
          setUser(newProfile);
        } else {
          throw profileError;
        }
      } else if (!profile) {
        console.error("Perfil não encontrado após login bem-sucedido");
        throw new Error("Perfil não encontrado após login bem-sucedido");
      } else {
        // Atualizar estado com o perfil obtido
        console.log("Perfil obtido após login:", profile);
        setUser(profile);
      }
      
      // Mostrar mensagem de sucesso
      toast.success("Login realizado com sucesso!");
      
      // Não redirecione aqui - o componente Login vai lidar com isso
      console.log("Login completo no AuthContext, aguardando componente Login redirecionar");
    } catch (error: any) {
      console.error("Erro completo de login:", error);
      
      // Tornar mensagens de erro mais amigáveis
      let errorMessage = "Verifique suas credenciais e tente novamente";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "E-mail ou senha incorretos";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "E-mail não confirmado";
      } else if (error.message?.includes("Tempo esgotado")) {
        errorMessage = "A operação está demorando muito. Verifique sua conexão e tente novamente";
      }
      
      toast.error("Erro ao fazer login", {
        description: errorMessage
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
