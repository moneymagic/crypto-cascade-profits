
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { InfoIcon, Key } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { saveApiKey, getApiKeys, deleteApiKey } from "@/lib/database";

const ApiKeyManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masterApiKey, setMasterApiKey] = useState("");
  const [masterApiSecret, setMasterApiSecret] = useState("");
  const [masterTestnet, setMasterTestnet] = useState(true);
  const [followerApiKey, setFollowerApiKey] = useState("");
  const [followerApiSecret, setFollowerApiSecret] = useState("");
  const [followerTestnet, setFollowerTestnet] = useState(true);
  const [hasMasterKey, setHasMasterKey] = useState(false);
  const [hasFollowerKey, setHasFollowerKey] = useState(false);

  useEffect(() => {
    async function loadApiKeys() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Carregar chaves de master trader
        const masterKeys = await getApiKeys(user.id, 'bybit_master');
        if (masterKeys && masterKeys.length > 0) {
          setMasterApiKey(masterKeys[0].api_key);
          setMasterApiSecret(masterKeys[0].api_secret);
          setMasterTestnet(masterKeys[0].is_testnet);
          setHasMasterKey(true);
        }
        
        // Carregar chaves de seguidor
        const followerKeys = await getApiKeys(user.id, 'bybit_follower');
        if (followerKeys && followerKeys.length > 0) {
          setFollowerApiKey(followerKeys[0].api_key);
          setFollowerApiSecret(followerKeys[0].api_secret);
          setFollowerTestnet(followerKeys[0].is_testnet);
          setHasFollowerKey(true);
        }
      } catch (error) {
        console.error("Erro ao carregar chaves de API:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas chaves de API.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadApiKeys();
  }, [user, toast]);

  const handleSaveMasterKey = async () => {
    if (!user) return;
    
    if (!masterApiKey || !masterApiSecret) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha tanto a API Key quanto o API Secret.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      await saveApiKey(
        user.id,
        'bybit_master',
        masterApiKey,
        masterApiSecret,
        masterTestnet
      );
      
      toast({
        title: "Chaves salvas",
        description: "Suas chaves de API de Master Trader foram salvas com sucesso."
      });
      
      setHasMasterKey(true);
    } catch (error) {
      console.error("Erro ao salvar chaves:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas chaves de API.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFollowerKey = async () => {
    if (!user) return;
    
    if (!followerApiKey || !followerApiSecret) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha tanto a API Key quanto o API Secret.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      await saveApiKey(
        user.id,
        'bybit_follower',
        followerApiKey,
        followerApiSecret,
        followerTestnet
      );
      
      toast({
        title: "Chaves salvas",
        description: "Suas chaves de API de Seguidor foram salvas com sucesso."
      });
      
      setHasFollowerKey(true);
    } catch (error) {
      console.error("Erro ao salvar chaves:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas chaves de API.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chaves de API da Bybit</CardTitle>
          <CardDescription>Gerencie suas chaves de API para copy trading.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <p>Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chaves de API da Bybit</CardTitle>
        <CardDescription>Gerencie suas chaves de API para copy trading.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="follower">
          <TabsList className="mb-6">
            <TabsTrigger value="follower">Conta Seguidor</TabsTrigger>
            <TabsTrigger value="master">Conta Master Trader</TabsTrigger>
          </TabsList>
          
          <TabsContent value="follower" className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                Estas chaves são necessárias para que você possa seguir master traders. 
                A plataforma usará estas chaves para executar operações automaticamente na sua conta da Bybit.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="follower-api-key">Bybit API Key</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="follower-api-key"
                    placeholder="Insira sua chave de API da Bybit" 
                    className="pl-10" 
                    value={followerApiKey}
                    onChange={(e) => setFollowerApiKey(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="follower-api-secret">Bybit API Secret</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="follower-api-secret"
                    type="password" 
                    placeholder="Insira seu API Secret da Bybit" 
                    className="pl-10" 
                    value={followerApiSecret}
                    onChange={(e) => setFollowerApiSecret(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 py-2">
                <Switch
                  id="follower-testnet"
                  checked={followerTestnet}
                  onCheckedChange={setFollowerTestnet}
                />
                <Label htmlFor="follower-testnet">Usar Testnet (ambiente de testes)</Label>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {followerTestnet ? 
                  "O Testnet é um ambiente de testes onde você pode experimentar o copy trading sem usar fundos reais." : 
                  "Atenção: Você está usando o ambiente de produção. As operações envolverão fundos reais."}
              </p>
              
              <Button 
                onClick={handleSaveFollowerKey}
                disabled={saving}
                className="w-full"
              >
                {saving ? "Salvando..." : hasFollowerKey ? "Atualizar chaves" : "Salvar chaves"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="master" className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                Estas chaves são necessárias apenas se você deseja se tornar um master trader. 
                A plataforma monitorará suas operações para replicá-las nas contas dos seus seguidores.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="master-api-key">Bybit API Key</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="master-api-key"
                    placeholder="Insira sua chave de API da Bybit" 
                    className="pl-10" 
                    value={masterApiKey}
                    onChange={(e) => setMasterApiKey(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="master-api-secret">Bybit API Secret</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="master-api-secret"
                    type="password" 
                    placeholder="Insira seu API Secret da Bybit" 
                    className="pl-10" 
                    value={masterApiSecret}
                    onChange={(e) => setMasterApiSecret(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 py-2">
                <Switch
                  id="master-testnet"
                  checked={masterTestnet}
                  onCheckedChange={setMasterTestnet}
                />
                <Label htmlFor="master-testnet">Usar Testnet (ambiente de testes)</Label>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {masterTestnet ? 
                  "O Testnet é um ambiente de testes onde você pode experimentar o copy trading sem usar fundos reais." : 
                  "Atenção: Você está usando o ambiente de produção. As operações envolverão fundos reais."}
              </p>
              
              <Button 
                onClick={handleSaveMasterKey}
                disabled={saving}
                className="w-full"
              >
                {saving ? "Salvando..." : hasMasterKey ? "Atualizar chaves" : "Salvar chaves"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiKeyManager;
