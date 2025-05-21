
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
}

// Lista de pares de trading comuns
export const tradingPairs = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 
  'ADAUSDT', 'DOGEUSDT', 'XRPUSDT', 'DOTUSDT'
];
