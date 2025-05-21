
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Key, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isTestnet, setIsTestnet] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  const handleApiSave = () => {
    if (!apiKey || !apiSecret) {
      toast({
        title: "Erro",
        description: "API Key e Secret são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Save credentials to localStorage (for demo purposes)
    localStorage.setItem("bybit_apiKey", apiKey);
    localStorage.setItem("bybit_apiSecret", apiSecret);
    localStorage.setItem("bybit_testnet", String(isTestnet));
    
    toast({
      title: "Configurações Salvas",
      description: "Suas configurações de API foram salvas com sucesso."
    });
  };

  const handlePasswordChange = () => {
    if (!currentPassword) {
      toast({
        title: "Erro",
        description: "Senha atual é obrigatória",
        variant: "destructive"
      });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      toast({
        title: "Erro",
        description: "Nova senha deve ter pelo menos 8 caracteres",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As novas senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    // Mock password change success
    toast({
      title: "Senha Alterada",
      description: "Sua senha foi alterada com sucesso."
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        
        <Tabs defaultValue="security">
          <TabsList className="mb-6">
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="mr-2 h-4 w-4" />
              Configuração de API
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="security">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
                  <CardTitle>
                    <div className="flex items-center">
                      <Lock className="mr-2 h-5 w-5" /> 
                      Trocar Senha
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input 
                      id="current-password" 
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input 
                      id="new-password" 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirme a Nova Senha</Label>
                    <Input 
                      id="confirm-password" 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                  </div>
                  
                  <Button onClick={handlePasswordChange} className="w-full">
                    Atualizar Senha
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
                  <CardTitle>
                    <div className="flex items-center">
                      <Shield className="mr-2 h-5 w-5" /> 
                      Configurações de Segurança
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações de Login</p>
                      <p className="text-sm text-muted-foreground">
                        Receber alertas quando sua conta for acessada
                      </p>
                    </div>
                    <Switch id="login-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autenticação de Dois Fatores</p>
                      <p className="text-sm text-muted-foreground">
                        Adicionar camada extra de segurança
                      </p>
                    </div>
                    <Switch id="2fa" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Atividade da Conta</p>
                      <p className="text-sm text-muted-foreground">
                        Manter registro de atividades importantes
                      </p>
                    </div>
                    <Switch id="account-activity" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
                <CardTitle>
                  <div className="flex items-center">
                    <Key className="mr-2 h-5 w-5" /> 
                    Configuração de API Bybit
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input 
                    id="api-key"
                    type="text" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Digite sua API Key da Bybit"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-secret">API Secret</Label>
                  <Input 
                    id="api-secret"
                    type="password" 
                    value={apiSecret}
                    onChange={(e) => setApiSecret(e.target.value)}
                    placeholder="Digite seu API Secret da Bybit"
                  />
                </div>
                
                <div className="flex items-center space-x-2 py-2">
                  <Switch
                    id="testnet"
                    checked={isTestnet}
                    onCheckedChange={setIsTestnet}
                  />
                  <Label htmlFor="testnet">Usar Testnet (ambiente de testes)</Label>
                </div>
                
                <Button 
                  onClick={handleApiSave}
                  className="w-full"
                >
                  Salvar Configurações de API
                </Button>
                
                <div className="text-sm text-muted-foreground mt-4">
                  <p className="font-medium">Importante:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Use apenas chaves de API com permissões limitadas</li>
                    <li>Crie chaves dedicadas para VastCopy</li>
                    <li>Nunca compartilhe suas chaves com terceiros</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
