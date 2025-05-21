
import BybitAPI from '@/lib/bybitApi';

// Resultado de um trade
export interface TradeResult {
  id: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  quantity: string;
  price: string;
  status: string;
  timestamp: Date;
  orderId?: string;
  source?: 'WebSocket' | 'Manual'; // Adds source information
}

// WebSocket message types
export interface WebSocketOrder {
  symbol: string;
  side: 'Buy' | 'Sell';
  price: string;
  qty: string;
  orderId: string;
  orderType: 'Market' | 'Limit';
  status: string;
  timestamp: number;
}

// WebSocket connection status
export type WebSocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// Monitoring settings (removed symbol filtering)
export interface MonitoringSettings {
  monitoringActive: boolean;
}

// Trading pairs for Bybit perpetual futures
export const tradingPairs = [
  "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", 
  "DOGEUSDT", "ADAUSDT", "DOTUSDT", "MATICUSDT", "LTCUSDT",
  "AVAXUSDT", "LINKUSDT", "ATOMUSDT", "UNIUSDT", "ETCUSDT"
];
