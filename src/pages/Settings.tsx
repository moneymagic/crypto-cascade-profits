import { DashboardLayout } from "@/components/layout/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Key, Lock, UserPlus, Wallet, BarChart } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import MasterTraderForm from "@/components/settings/MasterTraderForm";
import MasterTraderDashboard from "@/components/settings/MasterTraderDashboard";
import { useSearchParams } from "react-router-dom";
import { 
  useTraderStore, 
  masterTraderProfileToTraderData, 
  calculateTraderMetrics,
  updateTraderMetrics
} from "@/lib/traderStore";

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isTestnet, setIsTestnet] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isMasterTrader, setIsMasterTrader] = useState(false);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('security');
  
  // Get trader store actions
  const addTrader = useTraderStore(state => state.addTrader);

  useEffect(() => {
    // Check for tab param in URL
    const tabParam = searchParams.get('tab');
    if (tabParam && ['security', 'api', 'mastertrader'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    // For demonstration purposes, check if user is a master trader
    // In a real app, this would come from an API or auth state
    const checkMasterTraderStatus = () => {
      // Mock implementation - this would check with your backend
      const mockUserData = localStorage.getItem('user_data');
      if (mockUserData) {
        try {
          const userData = JSON.parse(mockUserData);
          setIsMasterTrader(userData.isMasterTrader || false);
        } catch (e) {
          console.error("Error parsing user data", e);
        }
      }
    };
    
    checkMasterTraderStatus();
  }, [searchParams]);

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

  // For handling photo previews in the form
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Handle master trader form submission
  const handleMasterTraderSubmit = (data) => {
    console.log("Submitted master trader application:", data);
    
    // Create a new trader profile for the trader store
    const traderData = masterTraderProfileToTraderData({
      name: data.name,
      strategyName: data.strategyName,
      bio: data.bio,
      photoUrl: photoPreview ? photoPreview : "",
      apiKey: data.apiKey,
      apiSecret: data.apiSecret
    });
    
    // Add the trader to the store
    addTrader(traderData);
    
    // Save user data to localStorage
    localStorage.setItem('user_data', JSON.stringify({
      ...JSON.parse(localStorage.getItem('user_data') || '{}'),
      isMasterTrader: true,
      masterTraderData: data,
      traderId: traderData.id
    }));
    
    setIsMasterTrader(true);
    
    toast({
      title: "Cadastro Realizado",
      description: "Seu cadastro como Master Trader foi concluído com sucesso! As métricas serão calculadas automaticamente com base nas suas operações na Bybit."
    });

    // Calcular métricas iniciais após um breve intervalo
    setTimeout(async () => {
      try {
        // Calcular métricas com base nas operações da Bybit
        const metrics = await calculateTraderMetrics(data.apiKey, data.apiSecret, true);
        
        // Atualizar trader com as métricas calculadas
        updateTraderMetrics(traderData.id, metrics);
        
        toast({
          title: "Métricas Atualizadas",
          description: "Suas métricas de desempenho foram calculadas com sucesso!"
        });
      } catch (error) {
        console.error("Erro ao calcular métricas iniciais:", error);
        toast({
          title: "Erro ao Calcular Métricas",
          description: "Ocorreu um erro ao calcular suas métricas de desempenho. Será feita uma nova tentativa mais tarde.",
          variant: "destructive"
        });
      }
    }, 2000);
  };
  
  // Handle canceling master trader status
  const handleCancelMasterTrader = () => {
    // Get the current user data
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    
    // If the user has a traderId, we could remove them from the store here
    // This is optional - you might want to keep their profile in the system
    // but mark it as inactive instead
    
    // Update localStorage
    userData.isMasterTrader = false;
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    setIsMasterTrader(false);
    
    toast({
      title: "Status Alterado",
      description: "Você não é mais um Master Trader e voltará a pagar taxas normalmente na plataforma."
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Configurações</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="mr-2 h-4 w-4" />
              Configuração de API
            </TabsTrigger>
            <TabsTrigger value="mastertrader">
              <UserPlus className="mr-2 h-4 w-4" />
              Master Trader
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
          
          <TabsContent value="mastertrader">
            {isMasterTrader ? (
              <div className="space-y-6">
                <Card className="mb-6">
                  <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
                    <CardTitle>
                      <div className="flex items-center">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Status Master Trader
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-center p-4 bg-green-50 border border-green-100 rounded-md">
                      <div className="bg-green-100 p-2 rounded-full mr-4">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-800">Conta Master Trader Ativa</h3>
                        <p className="text-sm text-green-600">
                          Sua conta possui privilégios de Master Trader. Você não paga taxas na plataforma 
                          e pode ser seguido por outros usuários.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md mb-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3 mt-0.5">
                          <Lock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-800">Restrições da Conta</h3>
                          <p className="text-sm text-blue-600">
                            Como Master Trader, você não pode seguir outros traders, mas pode ser seguido 
                            por outros usuários na plataforma.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={handleCancelMasterTrader}
                      >
                        Deixar de Ser Master Trader
                      </Button>
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Ao deixar de ser Master Trader, você voltará a pagar taxas normalmente e perderá os seguidores.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <MasterTraderDashboard onCancelMasterTrader={handleCancelMasterTrader} />
              </div>
            ) : (
              <Card>
                <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
                  <CardTitle>
                    <div className="flex items-center">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Torne-se um Master Trader
                    </div>
                  </CardTitle>
                  <CardDescription className="text-gray-200">
                    Preencha o formulário abaixo para se tornar um master trader na plataforma VastCopy.
                    Master Traders não pagam taxas e podem ser seguidos por outros usuários.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <MasterTraderForm onSubmit={handleMasterTraderSubmit} />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
