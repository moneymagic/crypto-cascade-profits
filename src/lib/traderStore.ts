
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

// Initial mock data
const initialTraders: TraderData[] = [
  {
    id: "1",
    name: "Carlos Almeida",
    avatar: "",
    winRate: "78%",
    followers: "1.2K",
    profit30d: "+32.5%",
    profit90d: "+87.3%",
    positive: true,
    verified: true,
    specialization: "BTC/ETH",
    description: "Trader especializado em Bitcoin e Ethereum com mais de 5 anos de experiência.",
  },
  {
    id: "2",
    name: "Daniela Santos",
    avatar: "",
    winRate: "67%",
    followers: "856",
    profit30d: "+18.3%",
    profit90d: "+52.8%",
    positive: true,
    verified: true,
    specialization: "Altcoins",
    description: "Foco em altcoins com potencial de crescimento e análise fundamentalista.",
  },
  {
    id: "3",
    name: "Fernando Costa",
    avatar: "",
    winRate: "72%",
    followers: "943",
    profit30d: "+24.7%",
    profit90d: "+61.5%",
    positive: true,
    verified: false,
    specialization: "NFT Tokens",
    description: "Especialista em tokens relacionados ao mercado de NFT e metaverso.",
  },
  {
    id: "4",
    name: "Márcia Oliveira",
    avatar: "",
    winRate: "81%",
    followers: "2.5K",
    profit30d: "+41.2%",
    profit90d: "+105.7%",
    positive: true,
    verified: true,
    specialization: "DeFi",
    description: "Estratégias em DeFi, yield farming e staking com resultados consistentes.",
  },
  {
    id: "5",
    name: "Roberto Mendes",
    avatar: "",
    winRate: "64%",
    followers: "721",
    profit30d: "+15.8%",
    profit90d: "+37.2%",
    positive: true,
    verified: false,
    specialization: "Swing Trading",
    description: "Trader de swing trading com base em análise técnica e indicadores.",
  },
  {
    id: "6",
    name: "Ana Clara Silva",
    avatar: "",
    winRate: "75%",
    followers: "1.1K",
    profit30d: "+28.2%",
    profit90d: "+71.9%",
    positive: true,
    verified: true,
    specialization: "Scalping",
    description: "Especialista em scalping com operações de curta duração e alto volume.",
  }
];

// Define the trader store type
interface TraderStore {
  traders: TraderData[];
  addTrader: (trader: TraderData) => void;
  removeTrader: (id: string) => void;
  updateTraderMetrics: (id: string, metrics: Partial<TraderData>) => void;
}

// Create the trader store with persistence
export const useTraderStore = create<TraderStore>()(
  persist(
    (set) => ({
      traders: initialTraders,
      addTrader: (trader: TraderData) => 
        set((state) => ({
          traders: [...state.traders, trader]
        })),
      removeTrader: (id: string) => 
        set((state) => ({
          traders: state.traders.filter(trader => trader.id !== id)
        })),
      updateTraderMetrics: (id: string, metrics: Partial<TraderData>) =>
        set((state) => ({
          traders: state.traders.map(trader => 
            trader.id === id 
              ? { ...trader, ...metrics, lastUpdated: new Date().toISOString() } 
              : trader
          )
        }))
    }),
    {
      name: 'trader-storage',
      // Only keep user-submitted traders in storage
      partialize: (state) => ({
        traders: state.traders.filter(t => t.isUserSubmitted)
      }),
      // Merge back with initial traders on load
      onRehydrateStorage: () => (state) => {
        if (state) {
          const userTraders = state.traders || [];
          state.traders = [
            ...initialTraders,
            ...userTraders
          ];
        }
      }
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
    lastUpdated: new Date().toISOString()
  };
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
