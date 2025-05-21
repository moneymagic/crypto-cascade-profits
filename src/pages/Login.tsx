
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
      
      await signIn(data.email, data.password);
      
      // Se chegou aqui, o login foi bem-sucedido e já deve ter redirecionado
      // Mas vamos adicionar um redirecionamento explícito aqui por segurança
      navigate("/traders");
      
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      
      if (error.code === "email_not_confirmed") {
        setEmailNotConfirmed(true);
        setEmailForResend(data.email);
      } else {
        setLoginError(error.message || "Erro ao fazer login. Por favor, tente novamente.");
      }
    } finally {
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
