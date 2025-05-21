
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
  
  constructor(credentials: BybitCredentials) {
    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
    this.baseUrl = credentials.testnet 
      ? 'https://api-testnet.bybit.com' 
      : 'https://api.bybit.com';
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
}

export default BybitAPI;
