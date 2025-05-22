
import { useState, useEffect, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import BybitAPI, { OrderParams } from '@/lib/bybitApi';
import { TradeResult, WebSocketStatus } from '@/components/bybit/types';

export function useBybitTrading() {
  // API Connections
  const [masterApi, setMasterApi] = useState<BybitAPI | null>(null);
  const [followerApi, setFollowerApi] = useState<BybitAPI | null>(null);
  
  // Status State
  const [isTradingEnabled, setIsTradingEnabled] = useState(false);
  const [tradeResults, setTradeResults] = useState<TradeResult[]>([]);
  const [masterBalance, setMasterBalance] = useState<number | null>(null);
  const [followerBalance, setFollowerBalance] = useState<number | null>(null);
  
  // WebSocket Listening State
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>('disconnected');
  const [isListening, setIsListening] = useState(false);

  // Habilitar trading apenas quando ambas as APIs estiverem conectadas
  useEffect(() => {
    setIsTradingEnabled(!!masterApi && !!followerApi);
  }, [masterApi, followerApi]);

  // Buscar saldos quando as APIs estiverem conectadas
  const fetchBalances = useCallback(async () => {
    console.log("Tentando buscar saldos das contas...");
    
    if (masterApi) {
      try {
        console.log("Buscando saldo da conta master...");
        const response = await masterApi.getWalletBalance();
        console.log("Resposta da API master:", response);
        
        // Verificar se a resposta inclui moedas
        if (response?.result?.list && response.result.list.length > 0) {
          // Buscar primeiro a moeda USDT
          const accountList = response.result.list;
          
          for (const account of accountList) {
            if (account.coin && Array.isArray(account.coin)) {
              const usdtCoin = account.coin.find((c: any) => c.coin === 'USDT');
              
              if (usdtCoin) {
                console.log("Saldo USDT encontrado na conta master:", usdtCoin);
                setMasterBalance(parseFloat(usdtCoin.walletBalance));
                break;
              }
            }
          }
          
          // Se não encontrou USDT especificamente, use o primeiro item disponível
          if (masterBalance === null && accountList[0].coin && accountList[0].coin.length > 0) {
            const firstCoin = accountList[0].coin[0];
            console.log("Usando primeira moeda disponível na conta master:", firstCoin);
            setMasterBalance(parseFloat(firstCoin.walletBalance));
          }
        } else {
          console.log("Nenhuma moeda encontrada na resposta da API master");
        }
      } catch (error) {
        console.error('Erro ao buscar saldo master:', error);
        toast({
          title: "Erro ao buscar saldo",
          description: "Não foi possível obter o saldo da conta master",
          variant: "destructive"
        });
      }
    }
    
    if (followerApi) {
      try {
        console.log("Buscando saldo da conta follower...");
        const response = await followerApi.getWalletBalance();
        console.log("Resposta da API follower:", response);
        
        // Verificar se a resposta inclui moedas
        if (response?.result?.list && response.result.list.length > 0) {
          // Buscar primeiro a moeda USDT
          const accountList = response.result.list;
          
          for (const account of accountList) {
            if (account.coin && Array.isArray(account.coin)) {
              const usdtCoin = account.coin.find((c: any) => c.coin === 'USDT');
              
              if (usdtCoin) {
                console.log("Saldo USDT encontrado na conta follower:", usdtCoin);
                setFollowerBalance(parseFloat(usdtCoin.walletBalance));
                break;
              }
            }
          }
          
          // Se não encontrou USDT especificamente, use o primeiro item disponível
          if (followerBalance === null && accountList[0].coin && accountList[0].coin.length > 0) {
            const firstCoin = accountList[0].coin[0];
            console.log("Usando primeira moeda disponível na conta follower:", firstCoin);
            setFollowerBalance(parseFloat(firstCoin.walletBalance));
          }
        } else {
          console.log("Nenhuma moeda encontrada na resposta da API follower");
        }
      } catch (error) {
        console.error('Erro ao buscar saldo follower:', error);
        toast({
          title: "Erro ao buscar saldo",
          description: "Não foi possível obter o saldo da conta follower",
          variant: "destructive"
        });
      }
    }
  }, [masterApi, followerApi, masterBalance, followerBalance]);

  // Buscar saldos imediatamente quando as APIs forem conectadas
  useEffect(() => {
    if (masterApi || followerApi) {
      fetchBalances();
    }
  }, [masterApi, followerApi, fetchBalances]);

  // Handler for WebSocket messages
  const handleWebSocketMessage = useCallback(async (data: any) => {
    console.log('WebSocket message received:', data);
    
    // Process execution data (filled orders)
    if (data.topic === 'execution' && data.data && followerApi) {
      // Loop through each execution in the data
      for (const execution of data.data) {
        // Only process filled buy/sell orders for perpetual futures
        if (execution.execType === 'Trade' && 
           (execution.side === 'Buy' || execution.side === 'Sell') &&
           execution.category === 'linear') {  // 'linear' refers to perpetual futures
          
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
              category: 'linear',  // Ensure we're using perpetual futures
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
  }, [followerApi, fetchBalances]);

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
          description: "Sistema está escutando as ordens de futuros perpétuos do Master Trader"
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

  // Cleanup WebSocket connection when component unmounts
  useEffect(() => {
    return () => {
      if (masterApi) {
        masterApi.disconnectWebSocket();
      }
    };
  }, [masterApi]);

  return {
    // API connections
    masterApi,
    setMasterApi,
    followerApi, 
    setFollowerApi,
    
    // Status state
    isTradingEnabled,
    tradeResults,
    masterBalance,
    followerBalance,
    
    // WebSocket listening
    wsStatus,
    isListening,
    startListening,
    stopListening,
    
    // Add fetchBalances to the return values
    fetchBalances
  };
}
