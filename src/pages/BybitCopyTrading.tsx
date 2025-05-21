
import React, { useEffect } from 'react';
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Wifi, WifiOff } from "lucide-react";
import LiveTradingSystem from "@/components/bybit/LiveTradingSystem";
import useCopyTradingService from "@/hooks/useCopyTradingService";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getApiKeys } from "@/lib/database";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const BybitCopyTrading = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isServiceActive, toggleService } = useCopyTradingService();
  const [hasMasterKey, setHasMasterKey] = useState(false);
  const [hasFollowerKey, setHasFollowerKey] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkApiKeys() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Verificar se o usuário tem chaves de API configuradas
        const masterKeys = await getApiKeys(user.id, 'bybit_master');
        const followerKeys = await getApiKeys(user.id, 'bybit_follower');
        
        setHasMasterKey(masterKeys && masterKeys.length > 0);
        setHasFollowerKey(followerKeys && followerKeys.length > 0);
      } catch (error) {
        console.error('Erro ao verificar chaves de API:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkApiKeys();
  }, [user]);

  const handleConfigureApiKeys = () => {
    navigate("/settings");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Copy Trading Bybit</h1>
          <p className="text-muted-foreground">
            Carregando informações do sistema de copy trading...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Copy Trading Bybit</h1>
          <p className="text-muted-foreground">
            Sistema avançado de copy trading para a exchange Bybit.
          </p>
        </div>
        
        {(!hasMasterKey && !hasFollowerKey) ? (
          <Card>
            <CardHeader>
              <CardTitle>Configuração Necessária</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertDescription>
                  Você precisa configurar suas chaves de API da Bybit para usar o sistema de copy trading.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <p>
                  O copy trading requer que você configure suas chaves de API da Bybit para possibilitar 
                  a monitoração das operações e replicação automática entre contas.
                </p>
                
                <p className="font-medium">Você pode escolher entre:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Conta Master Trader:</strong> Suas operações serão monitoradas e copiadas pelos seguidores.
                  </li>
                  <li>
                    <strong>Conta Seguidor:</strong> Você copia automaticamente as operações dos master traders que selecionar.
                  </li>
                </ul>
              </div>
              
              <Button onClick={handleConfigureApiKeys}>
                Configurar Chaves de API
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                {isServiceActive ? (
                  <>
                    <Wifi className="h-5 w-5 text-crypto-green" />
                    <span>Sistema de Copy Trading <Badge variant="outline" className="ml-2 bg-crypto-green/10 text-crypto-green border-crypto-green">Ativo</Badge></span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-5 w-5 text-muted-foreground" />
                    <span>Sistema de Copy Trading <Badge variant="outline" className="ml-2">Inativo</Badge></span>
                  </>
                )}
              </div>
              
              <Button 
                onClick={toggleService}
                variant={isServiceActive ? "outline" : "default"}
                className={isServiceActive ? "border-crypto-red text-crypto-red hover:bg-crypto-red/10" : "bg-crypto-green hover:bg-crypto-green/80 text-white"}
              >
                {isServiceActive ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Parar Sistema
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Iniciar Sistema
                  </>
                )}
              </Button>
            </div>
            
            {hasFollowerKey && (
              <Card>
                <CardHeader>
                  <CardTitle>Traders que você segue</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="active">
                    <TabsList className="mb-4">
                      <TabsTrigger value="active">Ativos</TabsTrigger>
                      <TabsTrigger value="history">Histórico</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="active">
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Você ainda não está seguindo nenhum trader.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => navigate('/traders')}
                        >
                          Encontrar Traders
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="history">
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Histórico vazio.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
            
            {hasMasterKey && (
              <LiveTradingSystem />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BybitCopyTrading;
