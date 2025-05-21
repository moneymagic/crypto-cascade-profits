
export type WebSocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface TradeResult {
  id: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  quantity: string;
  price: string;
  status: 'Detectada' | 'Replicada' | 'Erro';
  timestamp: Date;
  orderId?: string;
  source: 'WebSocket' | 'Manual';
}
