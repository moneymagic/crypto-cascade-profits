
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { tradingPairs } from './types';

interface OrderFormProps {
  symbol: string;
  side: 'Buy' | 'Sell';
  quantity: string;
  price: string;
  isExecuting: boolean;
  isTradingEnabled: boolean;
  onSymbolChange: (value: string) => void;
  onSideChange: (value: 'Buy' | 'Sell') => void;
  onQuantityChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onExecuteTrade: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  symbol,
  side,
  quantity,
  price,
  isExecuting,
  isTradingEnabled,
  onSymbolChange,
  onSideChange,
  onQuantityChange,
  onPriceChange,
  onExecuteTrade
}) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-4">Criar Nova Ordem</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="symbol">Par de Trading</Label>
          <Select value={symbol} onValueChange={onSymbolChange}>
            <SelectTrigger id="symbol">
              <SelectValue placeholder="Selecione o par" />
            </SelectTrigger>
            <SelectContent>
              {tradingPairs.map((pair) => (
                <SelectItem key={pair} value={pair}>{pair}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="side">Direção</Label>
          <Select value={side} onValueChange={onSideChange}>
            <SelectTrigger id="side">
              <SelectValue placeholder="Direção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Buy">Compra</SelectItem>
              <SelectItem value="Sell">Venda</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantidade</Label>
          <Input
            id="quantity"
            type="text"
            value={quantity}
            onChange={(e) => onQuantityChange(e.target.value)}
            placeholder="Ex: 0.001"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Preço (opcional)</Label>
          <Input
            id="price"
            type="text"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="Mercado"
          />
        </div>
      </div>
      
      <Button
        onClick={onExecuteTrade}
        disabled={!isTradingEnabled || isExecuting}
        className={`w-full ${side === 'Buy' ? 'bg-crypto-green hover:bg-crypto-green/80' : 'bg-crypto-red hover:bg-crypto-red/80'}`}
      >
        {isExecuting ? 'Executando...' : `${side === 'Buy' ? 'Comprar' : 'Vender'} ${symbol}`}
      </Button>
    </div>
  );
};

export default OrderForm;
