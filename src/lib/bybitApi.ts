
import crypto from 'crypto';

// Interface para as credenciais da API Bybit
export interface BybitCredentials {
  apiKey: string;
  apiSecret: string;
  testnet?: boolean;
}

// Interface para os parâmetros de ordem
export interface OrderParams {
  symbol: string;
  side: 'Buy' | 'Sell';
  orderType: 'Limit' | 'Market';
  qty: string;
  price?: string;
  timeInForce?: 'GoodTillCancel' | 'ImmediateOrCancel' | 'FillOrKill' | 'PostOnly';
  positionIdx?: number;
}

class BybitAPI {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;
  private wsUrl: string;
  private wsConnection: WebSocket | null = null;
  
  constructor(credentials: BybitCredentials) {
    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
    this.baseUrl = credentials.testnet 
      ? 'https://api-testnet.bybit.com' 
      : 'https://api.bybit.com';
    this.wsUrl = credentials.testnet
      ? 'wss://stream-testnet.bybit.com/v5/private'
      : 'wss://stream.bybit.com/v5/private';
  }
  
  // Método para gerar a assinatura necessária para autenticação
  private getSignature(timeStamp: number, params: Record<string, any> = {}): string {
    const queryString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
      
    const signString = `${timeStamp}${this.apiKey}${queryString}`;
    return crypto.createHmac('sha256', this.apiSecret).update(signString).digest('hex');
  }
  
  // Método genérico para fazer requisições à API
  private async request(
    endpoint: string, 
    method: 'GET' | 'POST' | 'DELETE', 
    params: Record<string, any> = {}
  ) {
    const timestamp = Date.now();
    const signature = this.getSignature(timestamp, params);
    
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'X-BAPI-API-KEY': this.apiKey,
      'X-BAPI-SIGN': signature,
      'X-BAPI-SIGN-TYPE': '2',
      'X-BAPI-TIMESTAMP': timestamp.toString(),
      'Content-Type': 'application/json'
    };
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' ? JSON.stringify(params) : undefined
      });
      
      if (!response.ok) {
        throw new Error(`Bybit API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Bybit API request failed:', error);
      throw error;
    }
  }
  
  // Método para verificar a conexão com a API
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.getWalletBalance();
      return !!response?.result;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
  
  // Obter saldo da carteira
  async getWalletBalance() {
    return await this.request('/v5/account/wallet-balance', 'GET', { accountType: 'UNIFIED' });
  }
  
  // Criar uma ordem
  async createOrder(orderParams: OrderParams) {
    return await this.request('/v5/order/create', 'POST', {
      category: 'spot',
      ...orderParams
    });
  }
  
  // Obter posições abertas
  async getPositions(symbol?: string) {
    const params: Record<string, any> = { category: 'linear' };
    if (symbol) params.symbol = symbol;
    
    return await this.request('/v5/position/list', 'GET', params);
  }

  // Obter histórico de ordens recentes
  async getRecentOrders(symbol?: string, limit: number = 50) {
    const params: Record<string, any> = { 
      category: 'spot',
      limit
    };
    if (symbol) params.symbol = symbol;
    
    return await this.request('/v5/order/history', 'GET', params);
  }

  // WebSocket Connection Methods

  // Conecta ao WebSocket da Bybit para receber atualizações em tempo real
  connectToWebSocket(onMessage: (data: any) => void, onOpen?: () => void, onError?: (error: Event) => void, onClose?: () => void) {
    if (this.wsConnection) {
      this.wsConnection.close();
    }

    try {
      this.wsConnection = new WebSocket(this.wsUrl);
      
      this.wsConnection.onopen = () => {
        console.log('WebSocket connection established');
        // Authenticate websocket connection
        const expires = Date.now() + 10000;
        const signature = this.getSignature(expires);
        
        const authMessage = JSON.stringify({
          op: 'auth',
          args: [this.apiKey, expires, signature]
        });
        
        this.wsConnection?.send(authMessage);
        
        // Subscribe to execution updates (filled orders)
        setTimeout(() => {
          if (this.wsConnection?.readyState === WebSocket.OPEN) {
            const subscribeMessage = JSON.stringify({
              op: 'subscribe',
              args: ['execution']
            });
            this.wsConnection.send(subscribeMessage);
            
            if (onOpen) onOpen();
          }
        }, 1000);
      };
      
      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error('WebSocket message parsing error:', e);
        }
      };
      
      this.wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
      };
      
      this.wsConnection.onclose = () => {
        console.log('WebSocket connection closed');
        this.wsConnection = null;
        if (onClose) onClose();
      };
      
      return true;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      return false;
    }
  }
  
  // Desconecta do WebSocket
  disconnectWebSocket() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
      return true;
    }
    return false;
  }
  
  // Verifica se o WebSocket está conectado
  isWebSocketConnected(): boolean {
    return this.wsConnection !== null && this.wsConnection.readyState === WebSocket.OPEN;
  }
}

export default BybitAPI;
