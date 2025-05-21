
import { useEffect, useState } from 'react';
import { useTraderStore, calculateTraderMetrics } from '@/lib/traderStore';
import { toast } from 'sonner';

// Hook para atualizar periodicamente as métricas dos traders
export function useTraderMetricsUpdate(interval: number = 3600000) { // Default: 1 hora
  const [isUpdating, setIsUpdating] = useState(false);
  const traders = useTraderStore(state => state.traders);
  const updateTraderMetrics = useTraderStore(state => state.updateTraderMetrics);
  
  // Função para atualizar métricas de todos os traders com API key
  const updateAllTraders = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      const tradersWithApi = traders.filter(
        trader => trader.isUserSubmitted && trader.apiKey && trader.apiSecret
      );
      
      if (tradersWithApi.length === 0) {
        setIsUpdating(false);
        return;
      }
      
      for (const trader of tradersWithApi) {
        try {
          const metrics = await calculateTraderMetrics(
            trader.apiKey!,
            trader.apiSecret!,
            true // Usar testnet por padrão
          );
          
          updateTraderMetrics(trader.id, metrics);
          
          console.log(`Métricas atualizadas para trader: ${trader.name}`);
        } catch (error) {
          console.error(`Erro ao atualizar métricas para trader ${trader.name}:`, error);
        }
      }
      
      toast.success("Métricas dos Master Traders atualizadas");
    } catch (error) {
      console.error("Erro ao atualizar métricas dos traders:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Configurar atualização periódica das métricas
  useEffect(() => {
    // Primeira atualização após carregar a página
    updateAllTraders();
    
    // Configurar intervalo para atualizações periódicas
    const updateInterval = setInterval(updateAllTraders, interval);
    
    // Limpar intervalos ao desmontar o componente
    return () => clearInterval(updateInterval);
  }, [interval]);
  
  return { isUpdating, updateNow: updateAllTraders };
}

export default useTraderMetricsUpdate;
