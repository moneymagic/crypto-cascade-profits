
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
  const [checkingCredentials, setCheckingCredentials] = useState(false);
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
      setCheckingCredentials(true);
      setEmailNotConfirmed(false);
      setLoginError("");
      
      console.log("Iniciando processo de login...");
      
      // Primeiro exibir feedback de verificação imediato
      toast.info("Verificando suas credenciais...", {
        duration: 3000,
      });
      
      // Verificar se o e-mail existe com um timeout reduzido para 3 segundos
      const checkEmailPromise = new Promise<any>(async (resolve, reject) => {
        try {
          const { data: existingUser, error: existingError } = await supabase
            .from("profiles")
            .select("email")
            .eq("email", data.email)
            .maybeSingle();
          
          resolve({ existingUser, existingError });
        } catch (error) {
          reject(error);
        }
      });
      
      // Configurar um timeout menor de 3 segundos
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Tempo esgotado ao verificar o e-mail")), 3000);
      });
      
      try {
        // Usar Promise.race para implementar um timeout
        const { existingUser, existingError } = await Promise.race([
          checkEmailPromise,
          timeoutPromise
        ]) as any;
        
        if (existingError) {
          console.error("Erro ao verificar existência de e-mail:", existingError);
          throw existingError;
        }
        
        if (!existingUser) {
          console.log("E-mail não encontrado:", data.email);
          setLoginError("E-mail não cadastrado. Por favor, verifique ou crie uma conta.");
          setLoading(false);
          setCheckingCredentials(false);
          return;
        }
        
        console.log("E-mail encontrado, verificando credenciais...");
        setCheckingCredentials(false);
        
        // Chamar signIn para autenticar com timeout
        const signInPromise = signIn(data.email, data.password);
        const signInWithTimeout = Promise.race([
          signInPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Tempo esgotado ao fazer login")), 5000)
          )
        ]);
        
        try {
          await signInWithTimeout;
          
          toast.success("Login realizado com sucesso!");
          
          // Redirecionar para /traders após sucesso
          console.log("Login bem-sucedido, redirecionando para /traders");
          navigate("/traders");
        } catch (error: any) {
          console.error("Erro ao fazer login:", error);
          
          if (error.message?.includes("Invalid login credentials")) {
            setLoginError("E-mail ou senha incorretos. Verifique suas credenciais.");
          } else if (error.message?.includes("Email not confirmed")) {
            setEmailNotConfirmed(true);
            setEmailForResend(data.email);
          } else if (error.message?.includes("Tempo esgotado")) {
            setLoginError("O login está demorando muito. Por favor, tente novamente.");
          } else {
            setLoginError(error.message || "Erro ao fazer login. Por favor, tente novamente.");
          }
        }
      } catch (error: any) {
        if (error.message?.includes("Tempo esgotado")) {
          setLoginError("A verificação do e-mail está demorando muito. Por favor, tente novamente.");
        } else {
          setLoginError("Erro ao verificar suas credenciais. Por favor, tente novamente.");
        }
      }
    } catch (error: any) {
      console.error("Erro não tratado ao fazer login:", error);
      setLoginError(error.message || "Erro ao fazer login. Por favor, tente novamente.");
    } finally {
      setLoading(false);
      setCheckingCredentials(false);
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
                      {checkingCredentials ? "Verificando..." : "Entrando..."}
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
