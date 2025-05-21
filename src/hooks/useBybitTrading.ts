
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import BybitAPI, { OrderParams } from '@/lib/bybitApi';
import { TradeResult } from '@/components/bybit/types';

export function useBybitTrading() {
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

  // Habilitar trading apenas quando ambas as APIs estiverem conectadas
  useEffect(() => {
    setIsTradingEnabled(!!masterApi && !!followerApi);
  }, [masterApi, followerApi]);

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
      // Parâmetros da ordem - Corrigindo o tipo para OrderParams
      const orderParams: OrderParams = {
        symbol,
        side,
        orderType: 'Market', // Agora é explicitamente 'Market', que é do tipo aceito
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

  return {
    masterApi,
    setMasterApi,
    followerApi, 
    setFollowerApi,
    symbol,
    setSymbol,
    side,
    setSide,
    quantity,
    setQuantity,
    price,
    setPrice,
    isTradingEnabled,
    isExecuting,
    tradeResults,
    masterBalance,
    followerBalance,
    executeRealTrade
  };
}
