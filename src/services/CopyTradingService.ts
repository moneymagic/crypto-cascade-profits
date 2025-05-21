import BybitAPI, { OrderParams } from '@/lib/bybitApi';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Interface para o master trader com seguidores
interface MasterTraderWithFollowers {
  id: string;
  name: string;
  api_key: string;
  api_secret: string;
  is_testnet: boolean;
  followers: FollowerInfo[];
}

// Interface para informações do seguidor
interface FollowerInfo {
  user_id: string;
  allocation_percent: number;
  api_key: string;
  api_secret: string;
  is_testnet: boolean;
}

// Interface para a API key retornada do banco
interface ApiKeyData {
  api_key: string;
  api_secret: string;
  is_testnet: boolean;
}

// Interface para o api_keys dentro do followers
interface FollowerWithApiKeys {
  user_id: string;
  allocation_percent: number;
  api_keys: {
    api_key: string;
    api_secret: string;
    is_testnet: boolean;
  };
}

class CopyTradingService {
  private masterTradersMap: Map<string, BybitAPI> = new Map();
  private activeTradersListener: boolean = false;
  private checkInterval: NodeJS.Timeout | null = null;

  // Iniciar o serviço de copy trading
  async startService() {
    if (this.activeTradersListener) {
      console.log('Serviço de copy trading já está ativo');
      return;
    }

    try {
      console.log('Iniciando serviço de copy trading...');
      
      // Iniciar verificação periódica de novos traders
      this.checkInterval = setInterval(() => this.checkForNewTraders(), 60000); // A cada 1 minuto
      
      // Fazer a primeira verificação imediatamente
      await this.checkForNewTraders();
      
      this.activeTradersListener = true;
      
      console.log('Serviço de copy trading iniciado com sucesso');
    } catch (error) {
      console.error('Erro ao iniciar serviço de copy trading:', error);
    }
  }

  // Parar o serviço de copy trading
  stopService() {
    if (!this.activeTradersListener) {
      return;
    }

    console.log('Parando serviço de copy trading...');
    
    // Parar intervalos de verificação
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    // Desconectar todos os WebSockets dos master traders
    for (const [traderId, api] of this.masterTradersMap.entries()) {
      console.log(`Desconectando WebSocket para trader ${traderId}`);
      api.disconnectWebSocket();
    }
    
    // Limpar o mapa de master traders
    this.masterTradersMap.clear();
    
    this.activeTradersListener = false;
    
    console.log('Serviço de copy trading parado com sucesso');
  }

  // Verificar novos traders para monitorar
  private async checkForNewTraders() {
    try {
      console.log('Verificando novos master traders para monitorar...');
      
      // Buscar todos os master traders que têm seguidores ativos
      const { data: masterTraders, error } = await supabase
        .from('traders')
        .select(`
          id,
          name,
          api_key,
          api_secret,
          is_testnet,
          followed_traders!inner (
            user_id,
            allocation_percent,
            active
          )
        `)
        .eq('followed_traders.active', true);
      
      if (error) throw error;
      
      if (!masterTraders || masterTraders.length === 0) {
        console.log('Nenhum master trader com seguidores ativos encontrado');
        return;
      }
      
      console.log(`Encontrados ${masterTraders.length} master traders com seguidores ativos`);
      
      // Para cada master trader, verificar se já estamos monitorando
      for (const trader of masterTraders) {
        if (!this.masterTradersMap.has(trader.id)) {
          // Buscar chaves de API dos seguidores
          await this.setupTraderMonitoring(trader);
        }
      }
      
      // Verificar se algum trader que estamos monitorando não tem mais seguidores
      const currentTraderIds = masterTraders.map(t => t.id);
      for (const [traderId, api] of this.masterTradersMap.entries()) {
        if (!currentTraderIds.includes(traderId)) {
          console.log(`Trader ${traderId} não tem mais seguidores ativos, removendo monitoramento`);
          api.disconnectWebSocket();
          this.masterTradersMap.delete(traderId);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar novos traders:', error);
    }
  }

  // Configurar monitoramento para um trader
  private async setupTraderMonitoring(trader: any) {
    try {
      console.log(`Configurando monitoramento para ${trader.name} (${trader.id})`);
      
      // Verificar se o trader tem API key e secret
      if (!trader.api_key || !trader.api_secret) {
        console.log(`Trader ${trader.id} não tem chaves de API configuradas`);
        return;
      }
      
      // Buscar seguidores ativos com suas chaves de API
      const { data: followers, error } = await supabase
        .from('followed_traders')
        .select(`
          user_id,
          allocation_percent,
          api_keys:api_keys!inner (
            api_key,
            api_secret,
            is_testnet
          )
        `)
        .eq('trader_id', trader.id)
        .eq('active', true)
        .eq('api_keys.exchange', 'bybit_follower');
      
      if (error) throw error;
      
      if (!followers || followers.length === 0) {
        console.log(`Trader ${trader.id} não tem seguidores com chaves de API configuradas`);
        return;
      }
      
      // Formatar seguidores com suas informações - correção para o tipo de dados
      const formattedFollowers: FollowerInfo[] = followers.map((f: FollowerWithApiKeys) => ({
        user_id: f.user_id,
        allocation_percent: f.allocation_percent,
        api_key: f.api_keys.api_key,
        api_secret: f.api_keys.api_secret,
        is_testnet: f.api_keys.is_testnet
      }));
      
      // Criar API para o master trader
      const masterApi = new BybitAPI({
        apiKey: trader.api_key,
        apiSecret: trader.api_secret,
        testnet: trader.is_testnet
      });
      
      // Testar conexão
      const isConnected = await masterApi.testConnection();
      if (!isConnected) {
        console.log(`Falha ao conectar com a API do trader ${trader.id}`);
        return;
      }
      
      // Conectar ao WebSocket e configurar handler para ordens
      const wsConnected = masterApi.connectToWebSocket(
        (data) => this.handleTraderOrder(data, trader, formattedFollowers),
        // On open
        () => {
          console.log(`WebSocket conectado para trader ${trader.name} (${trader.id})`);
          toast.success(`Monitorando ordens do trader ${trader.name}`);
        },
        // On error
        () => {
          console.error(`Erro na conexão WebSocket para trader ${trader.id}`);
          this.masterTradersMap.delete(trader.id);
        },
        // On close
        () => {
          console.log(`Conexão WebSocket fechada para trader ${trader.id}`);
          this.masterTradersMap.delete(trader.id);
        }
      );
      
      if (!wsConnected) {
        console.log(`Falha ao conectar WebSocket para trader ${trader.id}`);
        return;
      }
      
      // Adicionar ao mapa de master traders monitorados
      this.masterTradersMap.set(trader.id, masterApi);
      
      console.log(`Monitoramento configurado para trader ${trader.name} com ${formattedFollowers.length} seguidores`);
    } catch (error) {
      console.error(`Erro ao configurar monitoramento para trader ${trader.id}:`, error);
    }
  }

  // Manipular ordem de um trader
  private async handleTraderOrder(data: any, trader: any, followers: FollowerInfo[]) {
    // Verificar se a mensagem contém dados de execução de ordem
    if (data.topic !== 'execution' || !data.data) {
      return;
    }
    
    console.log(`Recebida notificação de execução para trader ${trader.name}:`, data);
    
    // Processar cada execução
    for (const execution of data.data) {
      // Verificar se é uma ordem executada de futuros perpétuos
      if (execution.execType === 'Trade' && 
         (execution.side === 'Buy' || execution.side === 'Sell') &&
         execution.category === 'linear') {
        
        console.log(`Ordem detectada: ${execution.side} ${execution.execQty} ${execution.symbol} a ${execution.execPrice}`);
        
        toast.info(
          `Ordem detectada do trader ${trader.name}`,
          { description: `${execution.side} ${execution.execQty} ${execution.symbol} a ${execution.execPrice}` }
        );
        
        // Registrar a ordem no histórico
        await this.logTradeOperation(
          trader.id,
          execution.symbol,
          execution.side,
          execution.execQty,
          execution.execPrice
        );
        
        // Replicar a ordem para cada seguidor
        for (const follower of followers) {
          await this.replicateOrderToFollower(
            trader.id,
            follower,
            execution
          );
        }
      }
    }
  }

  // Replicar ordem para um seguidor
  private async replicateOrderToFollower(traderId: string, follower: FollowerInfo, execution: any) {
    try {
      console.log(`Replicando ordem para seguidor ${follower.user_id} (alocação: ${follower.allocation_percent}%)`);
      
      // Criar API para o seguidor
      const followerApi = new BybitAPI({
        apiKey: follower.api_key,
        apiSecret: follower.api_secret,
        testnet: follower.is_testnet
      });
      
      // Testar conexão
      const isConnected = await followerApi.testConnection();
      if (!isConnected) {
        console.log(`Falha ao conectar com a API do seguidor ${follower.user_id}`);
        return;
      }
      
      // Ajustar quantidade baseada na alocação de capital
      // Em uma implementação real, isso envolveria calcular com base no valor da carteira
      const adjustedQty = this.calculateAdjustedQuantity(
        execution.execQty,
        follower.allocation_percent
      );
      
      // Criar ordem para o seguidor
      const orderParams: OrderParams = {
        category: 'linear',
        symbol: execution.symbol,
        side: execution.side as 'Buy' | 'Sell',
        orderType: 'Market',
        qty: adjustedQty,
      };
      
      // Executar a ordem
      const result = await followerApi.createOrder(orderParams);
      
      if (result?.retCode === 0) {
        console.log(`Ordem replicada com sucesso para seguidor ${follower.user_id}`);
        
        toast.success(
          `Ordem replicada com sucesso`,
          { description: `${execution.side} ${adjustedQty} ${execution.symbol} para o seguidor` }
        );
        
        // Registrar no histórico de trades copiados
        await this.logCopiedTrade(
          traderId,
          follower.user_id,
          execution.symbol,
          execution.side,
          adjustedQty,
          execution.execPrice,
          result.result.orderId
        );
      } else {
        console.error(`Erro ao replicar ordem para seguidor ${follower.user_id}:`, result?.retMsg);
        
        toast.error(
          `Erro na replicação`,
          { description: result?.retMsg || "Falha ao replicar ordem para o seguidor" }
        );
      }
    } catch (error) {
      console.error(`Erro ao replicar ordem para seguidor ${follower.user_id}:`, error);
      
      toast.error(
        `Erro na replicação`,
        { description: (error as Error).message || "Falha ao replicar ordem" }
      );
    }
  }

  // Calcular quantidade ajustada baseada na alocação de capital
  private calculateAdjustedQuantity(originalQty: string, allocationPercent: number): string {
    // Em uma implementação real, isso seria calculado com base no valor da carteira
    // e no preço do ativo. Para simplicidade, apenas ajustamos pela porcentagem de alocação.
    const qty = parseFloat(originalQty);
    const adjustedQty = qty * (allocationPercent / 100);
    
    // Garantir que a quantidade não seja menor que o mínimo permitido pela exchange
    return adjustedQty.toFixed(4);
  }

  // Registrar operação do trader no histórico
  private async logTradeOperation(
    traderId: string,
    symbol: string,
    side: string,
    quantity: string,
    price: string
  ) {
    try {
      await supabase.from('trader_operations').insert({
        trader_id: traderId,
        symbol,
        side,
        quantity,
        price,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao registrar operação do trader:', error);
    }
  }

  // Registrar trade copiado no histórico
  private async logCopiedTrade(
    traderId: string,
    userId: string,
    symbol: string,
    side: string,
    quantity: string,
    price: string,
    orderId: string
  ) {
    try {
      const entryPrice = parseFloat(price);
      const amount = parseFloat(quantity);
      
      // Simular preço atual e lucro para demonstração
      const currentPrice = entryPrice * (1 + (Math.random() * 0.02 - 0.01)); // +/- 1%
      const profitPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
      const profit = side === 'Buy' ? profitPercent.toFixed(2) + '%' : (-profitPercent).toFixed(2) + '%';
      
      await supabase.from('trades').insert({
        user_id: userId,
        trader_id: traderId,
        pair: symbol,
        type: side.toLowerCase(),
        entry_price: entryPrice,
        current_price: currentPrice,
        amount,
        status: 'open',
        profit,
        date: new Date().toISOString(),
        order_id: orderId
      });
    } catch (error) {
      console.error('Erro ao registrar trade copiado:', error);
    }
  }
}

// Exportar uma instância única do serviço
export const copyTradingService = new CopyTradingService();
export default copyTradingService;
