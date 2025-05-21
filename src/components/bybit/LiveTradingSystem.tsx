
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BybitAPI from '@/lib/bybitApi';
import BybitConnector from './BybitConnector';

interface TradeResult {
  id: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  quantity: string;
  price: string;
  status: string;
  timestamp: Date;
  orderId?: string;
}

const LiveTradingSystem = () => {
  const [masterApi, setMasterApi] = useState<BybitAPI | null>(null);
  const [followerApi, setFollowerApi] = useState<BybitAPI | null>(null);
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'Buy' | 'Sell'>('Buy');
  const [quantity, setQuantity] = useState('0.001');
  const [price, setPrice] = useState('');
  const [isTradingEnabled, setIsTradingEnabled] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tradeResults, setTradeResults] = useState<TradeResult[]>([]);
  const [masterBalance, setMasterBalance] = useState<number | null>(null);
  const [followerBalance, setFollowerBalance] = useState<number | null>(null);

  // Símbolos comuns para negociação na Bybit
  const tradingPairs = [
    'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 
    'ADAUSDT', 'DOGEUSDT', 'XRPUSDT', 'DOTUSDT'
  ];

  // Buscar saldos quando as APIs estiverem conectadas
  useEffect(() => {
    const fetchBalances = async () => {
      if (masterApi) {
        try {
          const response = await masterApi.getWalletBalance();
          if (response?.result?.list?.[0]?.coin?.find((c: any) => c.coin === 'USDT')) {
            const usdtCoin = response.result.list[0].coin.find((c: any) => c.coin === 'USDT');
            setMasterBalance(parseFloat(usdtCoin.walletBalance));
          }
        } catch (error) {
          console.error('Error fetching master balance:', error);
        }
      }
      
      if (followerApi) {
        try {
          const response = await followerApi.getWalletBalance();
          if (response?.result?.list?.[0]?.coin?.find((c: any) => c.coin === 'USDT')) {
            const usdtCoin = response.result.list[0].coin.find((c: any) => c.coin === 'USDT');
            setFollowerBalance(parseFloat(usdtCoin.walletBalance));
          }
        } catch (error) {
          console.error('Error fetching follower balance:', error);
        }
      }
    };
    
    fetchBalances();
  }, [masterApi, followerApi]);

  // Habilitar trading apenas quando ambas as APIs estiverem conectadas
  useEffect(() => {
    setIsTradingEnabled(!!masterApi && !!followerApi);
  }, [masterApi, followerApi]);

  // Função para executar uma operação real
  const executeRealTrade = async () => {
    if (!masterApi || !followerApi || !isTradingEnabled) {
      toast({
        title: "Erro",
        description: "Ambas as contas precisam estar conectadas",
        variant: "destructive"
      });
      return;
    }
    
    if (!symbol || !quantity) {
      toast({
        title: "Erro",
        description: "Símbolo e quantidade são obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    setIsExecuting(true);
    
    try {
      // Parâmetros da ordem
      const orderParams = {
        symbol,
        side,
        orderType: 'Market',
        qty: quantity,
      };
      
      // Executar ordem na conta Master
      const masterResult = await masterApi.createOrder(orderParams);
      console.log('Master trade result:', masterResult);
      
      if (masterResult?.retCode === 0) {
        toast({
          title: "Ordem Master Executada",
          description: `Ordem ${side} de ${quantity} ${symbol} executada com sucesso`
        });
        
        // Registrar resultado da ordem Master
        const masterTradeResult: TradeResult = {
          id: `master-${Date.now()}`,
          symbol,
          side,
          quantity,
          price: masterResult.result.price || price || 'Mercado',
          status: 'Executada',
          timestamp: new Date(),
          orderId: masterResult.result.orderId
        };
        
        setTradeResults(prev => [masterTradeResult, ...prev]);
        
        // Executar ordem espelhada na conta do Seguidor
        const followerResult = await followerApi.createOrder(orderParams);
        console.log('Follower trade result:', followerResult);
        
        if (followerResult?.retCode === 0) {
          toast({
            title: "Ordem Replicada com Sucesso",
            description: `Ordem ${side} de ${quantity} ${symbol} replicada para o seguidor`
          });
          
          // Registrar resultado da ordem do Seguidor
          const followerTradeResult: TradeResult = {
            id: `follower-${Date.now()}`,
            symbol,
            side,
            quantity,
            price: followerResult.result.price || price || 'Mercado',
            status: 'Replicada',
            timestamp: new Date(),
            orderId: followerResult.result.orderId
          };
          
          setTradeResults(prev => [followerTradeResult, ...prev]);
          
          // Atualizar saldos
          setTimeout(async () => {
            if (masterApi) {
              const response = await masterApi.getWalletBalance();
              if (response?.result?.list?.[0]?.coin?.find((c: any) => c.coin === 'USDT')) {
                const usdtCoin = response.result.list[0].coin.find((c: any) => c.coin === 'USDT');
                setMasterBalance(parseFloat(usdtCoin.walletBalance));
              }
            }
            
            if (followerApi) {
              const response = await followerApi.getWalletBalance();
              if (response?.result?.list?.[0]?.coin?.find((c: any) => c.coin === 'USDT')) {
                const usdtCoin = response.result.list[0].coin.find((c: any) => c.coin === 'USDT');
                setFollowerBalance(parseFloat(usdtCoin.walletBalance));
              }
            }
          }, 3000);
        } else {
          toast({
            title: "Erro na Replicação",
            description: followerResult.retMsg || "Falha ao replicar ordem para o seguidor",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Erro na Ordem Master",
          description: masterResult.retMsg || "Falha ao executar ordem master",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Trade execution error:', error);
      toast({
        title: "Erro na execução",
        description: error.message || "Falha ao executar operação",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Formatar data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
        <CardTitle>Sistema de Trading ao Vivo - Bybit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BybitConnector
            type="master"
            onConnect={setMasterApi}
            onDisconnect={() => setMasterApi(null)}
            isConnected={!!masterApi}
          />
          <BybitConnector
            type="follower"
            onConnect={setFollowerApi}
            onDisconnect={() => setFollowerApi(null)}
            isConnected={!!followerApi}
          />
        </div>
        
        {(masterBalance !== null || followerBalance !== null) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {masterBalance !== null && (
              <div className="p-4 rounded-lg bg-secondary/20">
                <div className="text-sm text-muted-foreground">Saldo Master (USDT)</div>
                <div className="text-xl font-semibold">{masterBalance.toFixed(2)}</div>
              </div>
            )}
            {followerBalance !== null && (
              <div className="p-4 rounded-lg bg-secondary/20">
                <div className="text-sm text-muted-foreground">Saldo Seguidor (USDT)</div>
                <div className="text-xl font-semibold">{followerBalance.toFixed(2)}</div>
              </div>
            )}
          </div>
        )}
        
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Criar Nova Ordem</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Par de Trading</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger id="symbol">
                  <SelectValue placeholder="Selecione o par" />
                </SelectTrigger>
                <SelectContent>
                  {tradingPairs.map((pair) => (
                    <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="side">Direção</Label>
              <Select value={side} onValueChange={(value: 'Buy' | 'Sell') => setSide(value)}>
                <SelectTrigger id="side">
                  <SelectValue placeholder="Direção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buy">Compra</SelectItem>
                  <SelectItem value="Sell">Venda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Ex: 0.001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Preço (opcional)</Label>
              <Input
                id="price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Mercado"
              />
            </div>
          </div>
          
          <Button
            onClick={executeRealTrade}
            disabled={!isTradingEnabled || isExecuting}
            className={`w-full ${side === 'Buy' ? 'bg-crypto-green hover:bg-crypto-green/80' : 'bg-crypto-red hover:bg-crypto-red/80'}`}
          >
            {isExecuting ? 'Executando...' : `${side === 'Buy' ? 'Comprar' : 'Vender'} ${symbol}`}
          </Button>
        </div>
        
        <Tabs defaultValue="results">
          <TabsList className="mb-4">
            <TabsTrigger value="results">Operações</TabsTrigger>
            <TabsTrigger value="info">Informações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="results">
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data/Hora</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Par</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Direção</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Quantidade</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Preço</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tradeResults.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">
                          Nenhuma operação realizada ainda. Conecte as contas e execute uma operação para começar.
                        </td>
                      </tr>
                    ) : (
                      tradeResults.map(result => (
                        <tr key={result.id}>
                          <td className="px-4 py-3 text-sm">{formatDate(result.timestamp)}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="outline" className={result.id.startsWith('master') ? 'border-primary text-primary' : 'border-crypto-blue text-crypto-blue'}>
                              {result.id.startsWith('master') ? 'Master' : 'Seguidor'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{result.symbol}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant={result.side === 'Buy' ? 'default' : 'destructive'}>
                              {result.side === 'Buy' ? 'Compra' : 'Venda'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{result.quantity}</td>
                          <td className="px-4 py-3 text-sm">{result.price}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="outline" className="border-crypto-green text-crypto-green">
                              {result.status}
                            </Badge>
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
                <h3 className="font-semibold mb-2">Como Funciona o Copy Trading Real</h3>
                <p className="text-sm">
                  Este sistema permite conectar duas contas Bybit para replicar trades em tempo real:
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Conecte uma conta como Master Trader (que cria as ordens originais)</li>
                  <li>Conecte outra conta como Seguidor (que recebe as ordens replicadas)</li>
                  <li>Execute operações na conta Master e veja elas sendo replicadas automaticamente</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Permissões de API Necessárias</h3>
                <p className="text-sm">
                  Para este sistema funcionar, você precisa criar API Keys na Bybit com as seguintes permissões:
                </p>
                <ul className="list-disc list-inside text-sm mt-2">
                  <li>Leitura (Account & Orders)</li>
                  <li>Escrita (Orders)</li>
                  <li>Sem permissão de saque (por segurança)</li>
                </ul>
                <p className="text-sm mt-2">
                  Recomendamos usar o Testnet para testes, que permite operar com saldo virtual.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiveTradingSystem;
