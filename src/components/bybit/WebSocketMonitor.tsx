
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WebSocketStatus } from './types';
import { RefreshCw } from "lucide-react";

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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Monitoramento Automático de Futuros Perpétuos</h3>
          <p className="text-sm text-muted-foreground">Escuta todas as ordens de futuros perpétuos do Master Trader e as replica automaticamente</p>
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
            O sistema está escutando todas as ordens de futuros perpétuos do Master Trader e replicando-as automaticamente para a conta do Seguidor.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WebSocketMonitor;
