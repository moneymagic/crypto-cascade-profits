
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import BybitAPI from '@/lib/bybitApi';
import { getApiKeys, saveApiKey } from '@/lib/database';
import { useAuth } from "@/contexts/AuthContext";

interface BybitConnectorProps {
  type: 'master' | 'follower';
  onConnect: (api: BybitAPI) => void;
  onDisconnect: () => void;
  isConnected: boolean;
}

const BybitConnector = ({ type, onConnect, onDisconnect, isConnected }: BybitConnectorProps) => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isTestnet, setIsTestnet] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar chaves de API do banco de dados
  useEffect(() => {
    async function loadApiKeys() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const keys = await getApiKeys(user.id, `bybit_${type}`);
        
        if (keys && keys.length > 0) {
          setApiKey(keys[0].api_key);
          setApiSecret(keys[0].api_secret);
          setIsTestnet(keys[0].is_testnet);
          
          // Auto-conectar se as credenciais existirem
          if (!isConnected) {
            const bybitApi = new BybitAPI({
              apiKey: keys[0].api_key,
              apiSecret: keys[0].api_secret,
              testnet: keys[0].is_testnet
            });
            
            onConnect(bybitApi);
          }
        }
      } catch (error) {
        console.error('Error loading API keys:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadApiKeys();
  }, [user, type, isConnected, onConnect]);

  const handleConnect = async () => {
    if (!apiKey || !apiSecret || !user) {
      toast({
        title: "Erro",
        description: "API Key e Secret são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      const bybitApi = new BybitAPI({
        apiKey,
        apiSecret,
        testnet: isTestnet
      });
      
      // Testar conexão
      const isSuccess = await bybitApi.testConnection();
      
      if (isSuccess) {
        // Salvar credenciais no banco de dados
        await saveApiKey(
          user.id,
          `bybit_${type}`,
          apiKey,
          apiSecret,
          isTestnet
        );
        
        toast({
          title: "Conexão Estabelecida",
          description: `Conta ${type === 'master' ? 'Master' : 'Seguidor'} conectada com sucesso.`
        });
        onConnect(bybitApi);
      } else {
        toast({
          title: "Falha na Conexão",
          description: "Não foi possível conectar com a Bybit. Verifique suas credenciais.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Erro na conexão",
        description: "Ocorreu um erro ao conectar com a Bybit.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
    
    toast({
      title: "Desconectado",
      description: `Conta ${type === 'master' ? 'Master' : 'Seguidor'} desconectada.`
    });
  };

  if (isLoading) {
    return (
      <Card className="border shadow-md">
        <CardHeader>
          <CardTitle>
            {type === 'master' ? 'Conta Master Trader (Bybit)' : 'Conta Seguidor (Bybit)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-pulse h-6 w-32 bg-secondary rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-md">
      <CardHeader>
        <CardTitle>
          {type === 'master' ? 'Conta Master Trader (Bybit)' : 'Conta Seguidor (Bybit)'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${type}-apiKey`}>API Key</Label>
              <Input 
                id={`${type}-apiKey`}
                type="text" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Digite sua API Key da Bybit"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`${type}-apiSecret`}>API Secret</Label>
              <Input 
                id={`${type}-apiSecret`}
                type="password" 
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Digite seu API Secret da Bybit"
              />
            </div>
            
            <div className="flex items-center space-x-2 py-2">
              <Switch
                id={`${type}-testnet`}
                checked={isTestnet}
                onCheckedChange={setIsTestnet}
              />
              <Label htmlFor={`${type}-testnet`}>Usar Testnet (ambiente de testes)</Label>
            </div>
            
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? 'Conectando...' : 'Conectar Conta Bybit'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Status</div>
                <div className="flex items-center mt-1">
                  <span className="h-2 w-2 rounded-full bg-crypto-green mr-2"></span>
                  <Badge variant="outline" className="border-crypto-green text-crypto-green">
                    Conectado
                  </Badge>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={handleDisconnect}
              >
                Desconectar
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {isTestnet ? 
                "Conectado ao ambiente de testes (Testnet). Ideal para testes sem usar fundos reais." : 
                "Conectado ao ambiente de produção. Atenção: operações envolvem fundos reais."}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BybitConnector;
