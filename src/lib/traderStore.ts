import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase';
import { toast } from "sonner";

// Define the trader data type
export interface TraderData {
  id: string;
  name: string;
  avatar: string;
  winRate: string;
  followers: string;
  profit30d: string;
  profit90d: string;
  positive: boolean;
  verified: boolean;
  specialization: string;
  description: string;
  isUserSubmitted?: boolean;
  dateCreated?: string;
  apiKey?: string;
  apiSecret?: string;
  lastUpdated?: string;
  user_id?: string;
}

// Define the trader store type
interface TraderStore {
  traders: TraderData[];
  loading: boolean;
  error: string | null;
  fetchTraders: () => Promise<void>;
  addTrader: (trader: TraderData) => Promise<void>;
  removeTrader: (id: string) => Promise<void>;
  updateTraderMetrics: (id: string, metrics: Partial<TraderData>) => Promise<void>;
}

// Create the trader store with persistence
export const useTraderStore = create<TraderStore>()(
  persist(
    (set, get) => ({
      traders: [],
      loading: false,
      error: null,
      
      fetchTraders: async () => {
        try {
          set({ loading: true, error: null });
          
          // Buscar traders do banco de dados
          const { data, error } = await supabase
            .from('traders')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          // Mapear para o formato usado pela aplicação
          const mappedTraders: TraderData[] = data.map(trader => ({
            id: trader.id,
            name: trader.name,
            avatar: trader.avatar_url || '',
            winRate: trader.win_rate,
            followers: trader.followers,
            profit30d: trader.profit_30d,
            profit90d: trader.profit_90d,
            positive: trader.positive,
            verified: trader.verified,
            specialization: trader.specialization,
            description: trader.description,
            isUserSubmitted: !!trader.user_id,
            dateCreated: trader.created_at,
            apiKey: trader.api_key || undefined,
            apiSecret: trader.api_secret || undefined,
            lastUpdated: trader.updated_at || trader.created_at,
            user_id: trader.user_id
          }));
          
          set({ traders: mappedTraders, loading: false });
        } catch (error) {
          console.error("Erro ao buscar traders:", error);
          set({ error: "Falha ao carregar traders", loading: false });
          toast.error("Falha ao carregar traders", {
            description: "Não foi possível buscar os traders. Tente novamente mais tarde."
          });
        }
      },
      
      addTrader: async (trader: TraderData) => {
        try {
          set({ loading: true, error: null });
          
          // Inserir no banco de dados
          const { data, error } = await supabase
            .from('traders')
            .insert({
              id: trader.id,
              name: trader.name,
              avatar_url: trader.avatar || null,
              win_rate: trader.winRate,
              followers: trader.followers,
              profit_30d: trader.profit30d,
              profit_90d: trader.profit90d,
              positive: trader.positive,
              verified: trader.verified,
              specialization: trader.specialization,
              description: trader.description,
              user_id: trader.user_id || null,
              api_key: trader.apiKey || null,
              api_secret: trader.apiSecret || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select();
            
          if (error) throw error;
          
          // Adicionar ao estado local
          set(state => ({
            traders: [...state.traders, trader],
            loading: false
          }));
          
          toast.success("Trader adicionado com sucesso", {
            description: "O trader foi adicionado à plataforma com sucesso."
          });
        } catch (error) {
          console.error("Erro ao adicionar trader:", error);
          set({ error: "Falha ao adicionar trader", loading: false });
          toast.error("Erro ao adicionar trader", {
            description: "Não foi possível adicionar o trader. Tente novamente."
          });
        }
      },
      
      removeTrader: async (id: string) => {
        try {
          set({ loading: true, error: null });
          
          // Remover do banco de dados
          const { error } = await supabase
            .from('traders')
            .delete()
            .eq('id', id);
            
          if (error) throw error;
          
          // Remover do estado local
          set(state => ({
            traders: state.traders.filter(trader => trader.id !== id),
            loading: false
          }));
          
          toast.success("Trader removido com sucesso", {
            description: "O trader foi removido da plataforma."
          });
        } catch (error) {
          console.error("Erro ao remover trader:", error);
          set({ error: "Falha ao remover trader", loading: false });
          toast.error("Erro ao remover trader", {
            description: "Não foi possível remover o trader. Tente novamente."
          });
        }
      },
      
      updateTraderMetrics: async (id: string, metrics: Partial<TraderData>) => {
        try {
          set({ loading: true, error: null });
          
          // Atualizar no banco de dados
          const { error } = await supabase
            .from('traders')
            .update({
              win_rate: metrics.winRate,
              profit_30d: metrics.profit30d,
              profit_90d: metrics.profit90d,
              positive: metrics.positive,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);
            
          if (error) throw error;
          
          // Atualizar no estado local
          set(state => ({
            traders: state.traders.map(trader => 
              trader.id === id 
                ? { ...trader, ...metrics, lastUpdated: new Date().toISOString() } 
                : trader
            ),
            loading: false
          }));
          
          toast.success("Métricas atualizadas", {
            description: "As métricas do trader foram atualizadas com sucesso."
          });
        } catch (error) {
          console.error("Erro ao atualizar métricas do trader:", error);
          set({ error: "Falha ao atualizar métricas", loading: false });
          toast.error("Falha ao atualizar métricas", {
            description: "Não foi possível atualizar as métricas. Tente novamente."
          });
        }
      }
    }),
    {
      name: 'trader-storage',
      partialize: (state) => ({
        traders: [] // Não persistir traders no localStorage, buscar sempre do Supabase
      }),
    }
  )
);

// Helper function to generate a unique ID
export const generateTraderId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Helper to convert profile data to trader data
export const masterTraderProfileToTraderData = (profile: any): TraderData => {
  return {
    id: generateTraderId(),
    name: profile.name || "Trader",
    avatar: profile.photoUrl || "",
    winRate: "0%", // Será calculado com base nos dados da API
    followers: "0",
    profit30d: "+0%", // Será calculado com base nos dados da API
    profit90d: "+0%", // Será calculado com base nos dados da API
    positive: true,
    verified: false,
    specialization: profile.strategyName || "Crypto",
    description: profile.bio || "",
    isUserSubmitted: true,
    dateCreated: new Date().toISOString(),
    apiKey: profile.apiKey,
    apiSecret: profile.apiSecret,
    lastUpdated: new Date().toISOString(),
    user_id: undefined // Vamos definir isso após obter o ID do usuário
  };
};

// Versão assíncrona para definir o user_id após criar o objeto
export const createMasterTraderProfileWithUserId = async (profile: any): Promise<TraderData> => {
  // Criar o objeto TraderData primeiro sem o user_id
  const traderData = masterTraderProfileToTraderData(profile);
  
  try {
    // Obter o usuário atual
    const { data } = await supabase.auth.getUser();
    // Definir o user_id se o usuário estiver disponível
    if (data?.user) {
      traderData.user_id = data.user.id;
    }
  } catch (error) {
    console.error('Erro ao obter ID do usuário:', error);
  }
  
  return traderData;
};

// Função para calcular métricas com base nas operações da Bybit
export const calculateTraderMetrics = async (apiKey: string, apiSecret: string, testnet: boolean = false) => {
  try {
    // Importação dinâmica para evitar erros em SSR
    const { default: BybitAPI } = await import('./bybitApi');
    
    const api = new BybitAPI({
      apiKey,
      apiSecret,
      testnet
    });
    
    // Verificar conexão
    const isConnected = await api.testConnection();
    if (!isConnected) {
      throw new Error("Não foi possível conectar à API da Bybit");
    }
    
    // Obter histórico de operações
    const ordersResponse = await api.getRecentOrders();
    const positionsResponse = await api.getPositions();
    
    if (!ordersResponse?.result?.list || !positionsResponse?.result?.list) {
      throw new Error("Dados insuficientes para calcular métricas");
    }
    
    const orders = ordersResponse.result.list;
    const positions = positionsResponse.result.list;
    
    // Cálculos das métricas
    let totalTrades = orders.length;
    let winningTrades = orders.filter(order => parseFloat(order.realizedPnl || "0") > 0).length;
    let winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100).toFixed(1) + "%" : "0%";
    
    // Cálculo de lucro
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    const recentOrders30d = orders.filter(order => 
      new Date(order.createdTime) >= thirtyDaysAgo
    );
    
    const recentOrders90d = orders.filter(order => 
      new Date(order.createdTime) >= ninetyDaysAgo
    );
    
    // Calcular P&L para 30 e 90 dias
    let pnl30d = recentOrders30d.reduce((sum, order) => 
      sum + parseFloat(order.realizedPnl || "0"), 0);
    
    let pnl90d = recentOrders90d.reduce((sum, order) => 
      sum + parseFloat(order.realizedPnl || "0"), 0);
    
    // Calcular percentual baseado em um valor inicial estimado
    const estimatedInitialBalance = 1000; // Valor arbitrário para cálculo de percentual
    
    const profit30d = (pnl30d / estimatedInitialBalance * 100).toFixed(1);
    const profit90d = (pnl90d / estimatedInitialBalance * 100).toFixed(1);
    
    const profit30dStr = (pnl30d >= 0 ? "+" : "") + profit30d + "%";
    const profit90dStr = (pnl90d >= 0 ? "+" : "") + profit90d + "%";
    
    return {
      winRate,
      profit30d: profit30dStr,
      profit90d: profit90dStr,
      positive: pnl30d >= 0
    };
  } catch (error) {
    console.error("Erro ao calcular métricas do trader:", error);
    return {
      winRate: "0%",
      profit30d: "+0%",
      profit90d: "+0%",
      positive: true
    };
  }
};
