import { useState, useEffect, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";
import BybitAPI, { OrderParams } from '@/lib/bybitApi';
import { TradeResult, WebSocketStatus, tradingPairs } from '@/components/bybit/types';

export function useBybitTrading() {
  // API Connections
  const [masterApi, setMasterApi] = useState<BybitAPI | null>(null);
  const [followerApi, setFollowerApi] = useState<BybitAPI | null>(null);
  
  // Order Form State
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState<'Buy' | 'Sell'>('Buy');
  const [quantity, setQuantity] = useState('0.001');
  const [price, setPrice] = useState('');
  
  // Status State
  const [isTradingEnabled, setIsTradingEnabled] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tradeResults, setTradeResults] = useState<TradeResult[]>([]);
  const [masterBalance, setMasterBalance] = useState<number | null>(null);
  const [followerBalance, setFollowerBalance] = useState<number | null>(null);
  
  // WebSocket Listening State
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>('disconnected');
  const [isListening, setIsListening] = useState(false);
  const [monitoredSymbols, setMonitoredSymbols] = useState<string[]>(tradingPairs);

  // Habilitar trading apenas quando ambas as APIs estiverem conectadas
  useEffect(() => {
    setIsTradingEnabled(!!masterApi && !!followerApi);
  }, [masterApi, followerApi]);

  // Buscar saldos quando as APIs estiverem conectadas
  const fetchBalances = useCallback(async () => {
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
  }, [masterApi, followerApi]);

  useEffect(() => {
    fetchBalances();
  }, [masterApi, followerApi, fetchBalances]);

  // Handler for WebSocket messages
  const handleWebSocketMessage = useCallback(async (data: any) => {
    console.log('WebSocket message received:', data);
    
    // Process execution data (filled orders)
    if (data.topic === 'execution' && data.data && followerApi) {
      // Loop through each execution in the data
      for (const execution of data.data) {
        // Only process filled buy/sell orders
        if (execution.execType === 'Trade' && 
           (execution.side === 'Buy' || execution.side === 'Sell') &&
           monitoredSymbols.includes(execution.symbol)) {
          
          toast({
            title: "Ordem Detectada",
            description: `${execution.side} ${execution.execQty} ${execution.symbol} a ${execution.execPrice}`
          });
          
          // Record the master trader's order
          const masterTradeResult: TradeResult = {
            id: `master-${Date.now()}`,
            symbol: execution.symbol,
            side: execution.side as 'Buy' | 'Sell',
            quantity: execution.execQty,
            price: execution.execPrice,
            status: 'Detectada',
            timestamp: new Date(),
            orderId: execution.orderId,
            source: 'WebSocket'
          };
          
          setTradeResults(prev => [masterTradeResult, ...prev]);
          
          // Replicate the order to the follower account
          try {
            // Create order parameters
            const orderParams: OrderParams = {
              symbol: execution.symbol,
              side: execution.side as 'Buy' | 'Sell',
              orderType: 'Market',
              qty: execution.execQty,
            };
            
            // Execute the order on the follower account
            const followerResult = await followerApi.createOrder(orderParams);
            
            if (followerResult?.retCode === 0) {
              toast({
                title: "Ordem Replicada com Sucesso",
                description: `${execution.side} ${execution.execQty} ${execution.symbol} replicada para o seguidor`
              });
              
              // Record the follower's order result
              const followerTradeResult: TradeResult = {
                id: `follower-${Date.now()}`,
                symbol: execution.symbol,
                side: execution.side as 'Buy' | 'Sell',
                quantity: execution.execQty,
                price: followerResult.result.price || execution.execPrice,
                status: 'Replicada',
                timestamp: new Date(),
                orderId: followerResult.result.orderId,
                source: 'WebSocket'
              };
              
              setTradeResults(prev => [followerTradeResult, ...prev]);
              
              // Update account balances after trade
              setTimeout(fetchBalances, 3000);
            } else {
              toast({
                title: "Erro na Replicação",
                description: followerResult.retMsg || "Falha ao replicar ordem para o seguidor",
                variant: "destructive"
              });
            }
          } catch (error: any) {
            console.error('Order replication error:', error);
            toast({
              title: "Erro na Replicação",
              description: error.message || "Falha ao replicar ordem",
              variant: "destructive"
            });
          }
        }
      }
    }
  }, [followerApi, monitoredSymbols, fetchBalances]);

  // Start listening for master trader orders
  const startListening = useCallback(() => {
    if (!masterApi || !followerApi) {
      toast({
        title: "Erro",
        description: "Ambas as contas precisam estar conectadas",
        variant: "destructive"
      });
      return;
    }
    
    setWsStatus('connecting');
    
    // Connect to the WebSocket
    masterApi.connectToWebSocket(
      handleWebSocketMessage,
      // On open
      () => {
        setWsStatus('connected');
        setIsListening(true);
        toast({
          title: "Monitoramento Ativo",
          description: "Sistema está escutando as ordens do Master Trader"
        });
      },
      // On error
      () => {
        setWsStatus('error');
        setIsListening(false);
        toast({
          title: "Erro de Conexão",
          description: "Falha ao conectar ao WebSocket da Bybit",
          variant: "destructive"
        });
      },
      // On close
      () => {
        setWsStatus('disconnected');
        setIsListening(false);
        toast({
          title: "Monitoramento Desativado",
          description: "Conexão com o WebSocket encerrada"
        });
      }
    );
  }, [masterApi, followerApi, handleWebSocketMessage]);

  // Stop listening for master trader orders
  const stopListening = useCallback(() => {
    if (masterApi) {
      masterApi.disconnectWebSocket();
      setIsListening(false);
      setWsStatus('disconnected');
      toast({
        title: "Monitoramento Desativado",
        description: "Sistema parou de escutar as ordens do Master Trader"
      });
    }
  }, [masterApi]);

  // Toggle monitoring for specific symbols
  const toggleSymbolMonitoring = useCallback((symbol: string) => {
    setMonitoredSymbols(prev => 
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  }, []);

  // Cleanup WebSocket connection when component unmounts
  useEffect(() => {
    return () => {
      if (masterApi) {
        masterApi.disconnectWebSocket();
      }
    };
  }, [masterApi]);

  // Função para executar uma operação manual
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
      const orderParams: OrderParams = {
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
          orderId: masterResult.result.orderId,
          source: 'Manual'
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
            orderId: followerResult.result.orderId,
            source: 'Manual'
          };
          
          setTradeResults(prev => [followerTradeResult, ...prev]);
          
          // Atualizar saldos
          setTimeout(fetchBalances, 3000);
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

  return {
    // API connections
    masterApi,
    setMasterApi,
    followerApi, 
    setFollowerApi,
    
    // Order form state
    symbol,
    setSymbol,
    side,
    setSide,
    quantity,
    setQuantity,
    price,
    setPrice,
    
    // Status state
    isTradingEnabled,
    isExecuting,
    tradeResults,
    masterBalance,
    followerBalance,
    
    // Manual trade execution
    executeRealTrade,
    
    // WebSocket listening
    wsStatus,
    isListening,
    startListening,
    stopListening,
    monitoredSymbols,
    toggleSymbolMonitoring,
    
    // Add fetchBalances to the return values
    fetchBalances
  };
}
