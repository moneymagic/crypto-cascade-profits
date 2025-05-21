
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

// Lista de pares de trading comuns
export const tradingPairs = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 
  'ADAUSDT', 'DOGEUSDT', 'XRPUSDT', 'DOTUSDT'
];

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

// Filtered symbol list for monitoring
export interface MonitoringSettings {
  enabledSymbols: string[];
  monitoringActive: boolean;
}
