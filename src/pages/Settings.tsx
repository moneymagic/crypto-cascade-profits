
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import ApiKeyManager from "@/components/settings/ApiKeyManager";
import MasterTraderForm from "@/components/settings/MasterTraderForm";

const Settings = () => {
  const { user, signOut } = useAuth();
  const [formLoading, setFormLoading] = useState(false);
  // Fix the user metadata access
  const [name, setName] = useState(user?.user_metadata?.full_name || user?.email?.split('@')[0] || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormLoading(true);
    
    // Simular atualização de perfil
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso."
    });
    
    setFormLoading(false);
  };
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }
    
    setFormLoading(true);
    
    // Simular atualização de senha
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi atualizada com sucesso."
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFormLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências, informações pessoais e chaves de API.
          </p>
        </div>
        
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Conta</TabsTrigger>
            <TabsTrigger value="api-keys">Chaves de API</TabsTrigger>
            <TabsTrigger value="trader">Master Trader</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email"
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      disabled
                      className="max-w-md"
                    />
                    <p className="text-sm text-muted-foreground">
                      Seu endereço de e-mail não pode ser alterado.
                    </p>
                  </div>
                  
                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? "Atualizando..." : "Atualizar perfil"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Atualize sua senha.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha atual</Label>
                    <Input 
                      id="current-password"
                      type="password" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova senha</Label>
                    <Input 
                      id="new-password"
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                    <Input 
                      id="confirm-password"
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                  
                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? "Atualizando..." : "Atualizar senha"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sessão</CardTitle>
                <CardDescription>
                  Gerencie sua sessão atual.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  onClick={() => signOut()}
                >
                  Sair
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api-keys">
            <ApiKeyManager />
          </TabsContent>
          
          <TabsContent value="trader">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Master Trader</CardTitle>
                <CardDescription>
                  Cadastre-se para se tornar um master trader na plataforma VastCopy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MasterTraderForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
