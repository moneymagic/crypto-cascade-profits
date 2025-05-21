
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WebSocketStatus } from './types';
import { AlertCircle, CheckCircle2, Wifi, WifiOff } from "lucide-react";

interface WebSocketMonitorProps {
  wsStatus: WebSocketStatus;
  isListening: boolean;
  isTradingEnabled: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
}

const WebSocketMonitor: React.FC<WebSocketMonitorProps> = ({
  wsStatus,
  isListening,
  isTradingEnabled,
  onStartListening,
  onStopListening
}) => {
  const getStatusBadge = () => {
    switch (wsStatus) {
      case 'connected':
        return <Badge variant="outline" className="bg-crypto-green/10 text-crypto-green border-crypto-green">Conectado</Badge>;
      case 'connecting':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500">Conectando</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-crypto-red/10 text-crypto-red border-crypto-red">Erro</Badge>;
      default:
        return <Badge variant="outline">Desconectado</Badge>;
    }
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center gap-2">
          {wsStatus === 'connected' ? 
            <Wifi className="h-5 w-5 text-crypto-green" /> : 
            <WifiOff className="h-5 w-5 text-muted-foreground" />
          }
          <span className="font-medium">Status WebSocket:</span>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          {isListening && <span className="text-sm text-muted-foreground">Monitorando ordens</span>}
        </div>
      </div>
      
      <div className="w-full md:w-auto flex gap-2">
        {isListening ? (
          <Button 
            variant="outline" 
            className="border-crypto-red text-crypto-red hover:bg-crypto-red/10"
            onClick={onStopListening}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Parar Monitoramento
          </Button>
        ) : (
          <Button 
            className="bg-crypto-green hover:bg-crypto-green/80 text-white"
            disabled={!isTradingEnabled}
            onClick={onStartListening}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Iniciar Monitoramento
          </Button>
        )}
      </div>
    </div>
  );
};

export default WebSocketMonitor;
