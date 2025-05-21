
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

interface TradeResult {
  id: string;
  masterTrader: string;
  tradeAmount: number;
  profit: number;
  commissionTotal: number;
  commissionMaster: number;
  commissionNetwork: number;
  timestamp: Date;
}

const TestingEnvironment: React.FC = () => {
  const [masterConnected, setMasterConnected] = useState(false);
  const [followerConnected, setFollowerConnected] = useState(false);
  const [tradeResults, setTradeResults] = useState<TradeResult[]>([]);
  const [masterBalance, setMasterBalance] = useState(5000);
  const [followerBalance, setFollowerBalance] = useState(2000);
  
  // Simulação de conexão de conta Master
  const connectMaster = () => {
    setMasterConnected(true);
    toast({
      title: "Conectado como Master Trader",
      description: "API conectada com sucesso. Você pode criar operações agora."
    });
  };
  
  // Simulação de conexão de conta Seguidor
  const connectFollower = () => {
    setFollowerConnected(true);
    toast({
      title: "Conectado como Seguidor",
      description: "Pronto para copiar operações do Master Trader."
    });
  };
  
  // Simula uma operação lucrativa do Master Trader
  const simulateProfitableTrade = () => {
    if (!masterConnected || !followerConnected) {
      toast({
        title: "Erro",
        description: "Ambas as contas precisam estar conectadas",
        variant: "destructive"
      });
      return;
    }
    
    // Valores simulados
    const tradeAmount = 500; // Valor da operação
    const profitPercentage = Math.random() * 0.15 + 0.05; // Entre 5% e 20%
    const profit = tradeAmount * profitPercentage;
    
    // Cálculo de comissões
    const commissionTotal = profit * 0.3; // 30% do lucro
    const commissionMaster = profit * 0.1; // 10% para o Master
    const commissionNetwork = profit * 0.2; // 20% para a rede
    
    // Atualização dos saldos
    setMasterBalance(prev => prev + profit + commissionMaster);
    setFollowerBalance(prev => prev + profit - commissionTotal);
    
    // Registra o resultado
    const newResult: TradeResult = {
      id: `trade-${Date.now()}`,
      masterTrader: "Você (Master)",
      tradeAmount,
      profit,
      commissionTotal,
      commissionMaster,
      commissionNetwork,
      timestamp: new Date()
    };
    
    setTradeResults(prev => [newResult, ...prev]);
    
    toast({
      title: "Operação Simulada com Sucesso",
      description: `Lucro: $${profit.toFixed(2)} | Comissão total: $${commissionTotal.toFixed(2)}`
    });
  };
  
  // Formatar data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <Card className="border shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
        <CardTitle>Ambiente de Teste - Sistema de Comissões</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="font-semibold">Conta Master Trader</div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/20 text-primary">MT</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Você (Master Trader)</div>
                  <div className="text-sm text-muted-foreground">
                    Saldo: ${masterBalance.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={connectMaster}
                variant={masterConnected ? "outline" : "default"}
                disabled={masterConnected}
              >
                {masterConnected ? "Conectado" : "Conectar"}
              </Button>
            </div>
            
            <div className="font-semibold">Conta Seguidor</div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/20 text-primary">SF</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Seguidor Teste</div>
                  <div className="text-sm text-muted-foreground">
                    Saldo: ${followerBalance.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={connectFollower}
                variant={followerConnected ? "outline" : "default"}
                disabled={followerConnected}
              >
                {followerConnected ? "Conectado" : "Conectar"}
              </Button>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={simulateProfitableTrade} 
                disabled={!masterConnected || !followerConnected}
                className="w-full bg-crypto-green hover:bg-crypto-green/80"
              >
                Simular Operação Lucrativa
              </Button>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-4">Divisão de Comissão</div>
            <div className="space-y-2">
              <div className="p-4 rounded-lg bg-secondary/20">
                <div className="text-sm text-muted-foreground">Comissão Total</div>
                <div className="text-xl font-semibold">30% do Lucro</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-4 rounded-lg bg-secondary/20">
                  <div className="text-sm text-muted-foreground">Para Master Trader</div>
                  <div className="text-xl font-semibold">10%</div>
                </div>
                
                <div className="p-4 rounded-lg bg-secondary/20">
                  <div className="text-sm text-muted-foreground">Para Rede Multinível</div>
                  <div className="text-xl font-semibold">20%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="results">
          <TabsList className="mb-4">
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="info">Como Funciona</TabsTrigger>
          </TabsList>
          
          <TabsContent value="results">
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data/Hora</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Valor Operação</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Lucro</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Comissão Total</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Para Master</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Para Rede</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tradeResults.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                          Nenhuma operação simulada ainda. Clique em "Simular Operação Lucrativa" para começar.
                        </td>
                      </tr>
                    ) : (
                      tradeResults.map(result => (
                        <tr key={result.id}>
                          <td className="px-4 py-3 text-sm">{formatDate(result.timestamp)}</td>
                          <td className="px-4 py-3 text-sm">${result.tradeAmount.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-crypto-green">
                            +${result.profit.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ${result.commissionTotal.toFixed(2)}
                            <span className="text-xs text-muted-foreground ml-1">(30%)</span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ${result.commissionMaster.toFixed(2)}
                            <span className="text-xs text-muted-foreground ml-1">(10%)</span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ${result.commissionNetwork.toFixed(2)}
                            <span className="text-xs text-muted-foreground ml-1">(20%)</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
              <div>
                <h3 className="font-semibold mb-2">Como Funciona o Sistema de Comissões</h3>
                <p className="text-sm">
                  O sistema cobra 30% do lucro líquido de cada operação bem-sucedida, distribuídos da seguinte forma:
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>10% vai para o Master Trader que criou a estratégia</li>
                  <li>20% é distribuído na rede multinível (V1 ao V8)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Distribuição dos 20% na Rede</h3>
                <p className="text-sm">
                  O sistema usa o modelo de "Recompensa por diferença de ranking". Cada usuário recebe a diferença 
                  entre seu percentual e o percentual do maior ranking direto abaixo dele.
                </p>
                <p className="text-sm mt-2">
                  <span className="font-medium">Exemplo:</span> Se um usuário V6 (9%) tiver abaixo dele um V4 (7%), 
                  ele recebe 2%. Se tiver abaixo um V7 (10%), ele não recebe nada daquela linha.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TestingEnvironment;
