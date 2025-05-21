
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WebSocketStatus } from './types';
import { RefreshCw } from "lucide-react";

interface WebSocketMonitorProps {
  wsStatus: WebSocketStatus;
  isListening: boolean;
  isTradingEnabled: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  monitoredSymbols: string[];
  availableSymbols: string[];
  onToggleSymbol: (symbol: string) => void;
}

const WebSocketMonitor: React.FC<WebSocketMonitorProps> = ({
  wsStatus,
  isListening,
  isTradingEnabled,
  onStartListening,
  onStopListening,
  monitoredSymbols,
  availableSymbols,
  onToggleSymbol
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Monitoramento Automático</h3>
          <p className="text-sm text-muted-foreground">Escuta as ordens do Master Trader e as replica automaticamente</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant={
              wsStatus === 'connected' ? 'outline' :
              wsStatus === 'connecting' ? 'secondary' :
              wsStatus === 'error' ? 'destructive' : 'outline'
            }
            className={wsStatus === 'connected' ? 'border-green-500 text-green-500' : ''}
          >
            {wsStatus === 'connected' ? 'Conectado' :
             wsStatus === 'connecting' ? 'Conectando...' :
             wsStatus === 'error' ? 'Erro' : 'Desconectado'}
          </Badge>
          
          {isListening ? (
            <Button 
              variant="outline" 
              onClick={onStopListening}
              size="sm"
            >
              Parar Monitoramento
            </Button>
          ) : (
            <Button 
              onClick={onStartListening}
              disabled={!isTradingEnabled || wsStatus === 'connecting'}
              size="sm"
              className="gap-2"
            >
              <RefreshCw size={14} className={wsStatus === 'connecting' ? 'animate-spin' : ''} />
              Iniciar Monitoramento
            </Button>
          )}
        </div>
      </div>
      
      {isListening && (
        <Alert className="bg-green-500/10 border-green-500">
          <AlertTitle>Monitoramento Ativo</AlertTitle>
          <AlertDescription>
            O sistema está escutando as ordens do Master Trader e replicando-as automaticamente para a conta do Seguidor.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="border rounded-md p-4">
        <h4 className="font-medium mb-2">Pares Monitorados</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Selecione quais pares de trading serão monitorados para replicação automática
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {availableSymbols.map(symbol => (
            <div key={symbol} className="flex items-center space-x-2">
              <Switch
                id={`symbol-${symbol}`}
                checked={monitoredSymbols.includes(symbol)}
                onCheckedChange={() => onToggleSymbol(symbol)}
                disabled={!isListening}
              />
              <Label htmlFor={`symbol-${symbol}`}>{symbol}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebSocketMonitor;
