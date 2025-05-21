
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { VastCopyLogo } from "@/components/logo/VastCopyLogo";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [emailForResend, setEmailForResend] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      setLoading(true);
      setEmailNotConfirmed(false);
      setLoginError("");
      
      console.log("Iniciando processo de login...");
      console.log("Tentando fazer login com:", data.email);
      
      // Verificar se o e-mail existe no Supabase Auth
      console.log("Verificando se o e-mail existe...");
      const { data: existingUsers, error: existingError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", data.email)
        .maybeSingle();
        
      if (existingError) {
        console.error("Erro ao verificar e-mail:", existingError);
      }
      
      if (!existingUsers) {
        console.log("E-mail não encontrado no sistema:", data.email);
        setLoginError("E-mail não cadastrado. Por favor, verifique ou crie uma conta.");
        setLoading(false);
        return;
      }
      
      console.log("E-mail encontrado, verificando credenciais de autenticação...");
      
      // Tentativa direta de autenticação para capturar erros específicos
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (authError) {
        console.error("Erro na autenticação:", authError);
        
        // Tratando diferentes tipos de erros de autenticação
        if (authError.message.includes("Invalid login credentials")) {
          setLoginError("E-mail ou senha incorretos. Verifique suas credenciais.");
          setLoading(false);
          return;
        } else if (authError.message.includes("Email not confirmed")) {
          setEmailNotConfirmed(true);
          setEmailForResend(data.email);
          setLoading(false);
          return;
        } else {
          setLoginError(authError.message || "Erro ao fazer login. Por favor, tente novamente.");
          setLoading(false);
          return;
        }
      }
      
      if (!authData.user) {
        console.error("Autenticação falhou: nenhum usuário retornado");
        setLoginError("Erro ao autenticar. Por favor, tente novamente.");
        setLoading(false);
        return;
      }
      
      console.log("Autenticação bem-sucedida para:", authData.user.id);
      
      // Verificando se o perfil existe na tabela profiles
      console.log("Verificando se o perfil existe na tabela profiles...");
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("id", authData.user.id)
        .single();
      
      if (profileError && profileError.code === "PGRST116") {
        console.error("Perfil não encontrado para o usuário autenticado. Criando perfil...");
        
        // Criar um perfil básico para este usuário
        const { error: createError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            full_name: authData.user.user_metadata?.full_name || "Usuário",
            email: data.email,
            created_at: new Date().toISOString(),
            balance: 0,
          });
          
        if (createError) {
          console.error("Erro ao criar perfil:", createError);
          setLoginError("Erro ao criar perfil de usuário. Por favor, tente novamente.");
          // Fazer logout para limpar o estado de autenticação
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        
        console.log("Perfil criado com sucesso para:", authData.user.id);
      } else if (profileError) {
        console.error("Erro ao verificar perfil:", profileError);
        setLoginError("Erro ao verificar perfil. Por favor, tente novamente.");
        setLoading(false);
        return;
      } else {
        console.log("Perfil encontrado:", profileData);
      }
      
      // Neste ponto, a autenticação foi bem-sucedida e temos um perfil
      console.log("Login totalmente processado com sucesso!");
      
      try {
        // Chamar signIn para atualizar o estado global da aplicação
        console.log("Chamando signIn para atualizar contexto de autenticação...");
        await signIn(data.email, data.password);
        
        toast.success("Login realizado com sucesso!");
        console.log("Redirecionando para /traders em 1 segundo...");
        
        // Atraso maior para garantir que todas as operações assíncronas foram concluídas
        setTimeout(() => {
          console.log("Executando redirecionamento para /traders");
          navigate("/traders");
        }, 1000);
      } catch (signInError: any) {
        console.error("Erro ao fazer signIn no contexto:", signInError);
        setLoginError("Erro ao finalizar o processo de login. Por favor, tente novamente.");
        setLoading(false);
      }
      
    } catch (error: any) {
      console.error("Erro não tratado ao fazer login:", error);
      
      if (error.code === "email_not_confirmed") {
        setEmailNotConfirmed(true);
        setEmailForResend(data.email);
      } else if (error.message && error.message.includes("Invalid login credentials")) {
        setLoginError("E-mail ou senha incorretos. Verifique suas credenciais.");
      } else {
        setLoginError(error.message || "Erro ao fazer login. Por favor, tente novamente.");
      }
      setLoading(false);
    }
  }

  async function resendConfirmationEmail() {
    if (!emailForResend) return;
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailForResend,
      });
      
      if (error) throw error;
      
      toast.success("E-mail de confirmação reenviado com sucesso!", {
        description: "Por favor, verifique sua caixa de entrada e spam."
      });
    } catch (error: any) {
      console.error("Erro ao reenviar e-mail:", error);
      toast.error("Erro ao reenviar e-mail de confirmação", {
        description: error.message || "Tente novamente mais tarde"
      });
    } finally {
      setLoading(false);
    }
  }

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
            {emailNotConfirmed && (
              <Alert className="mb-6 bg-amber-50 border-amber-200">
                <AlertDescription className="text-amber-800">
                  <div className="flex flex-col gap-2">
                    <p>Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada e pasta de spam.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resendConfirmationEmail} 
                      disabled={loading}
                      className="self-start border-amber-500 text-amber-700 hover:bg-amber-100"
                    >
                      Reenviar e-mail de confirmação
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {loginError && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  {loginError}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="seu@email.com" 
                          type="email" 
                          {...field} 
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="••••••" 
                          type="password" 
                          {...field} 
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </Form>
            
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

export default Login;
