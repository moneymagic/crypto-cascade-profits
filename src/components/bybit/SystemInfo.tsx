
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const SystemInfo: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Sobre o Sistema de Copy Trading</h3>
          <p className="text-muted-foreground">
            Este sistema permite a cópia automática de operações de futuros perpétuos da Bybit entre uma conta master 
            e uma conta seguidora. O sistema monitora em tempo real as operações da conta master via WebSocket e as 
            replica na conta seguidora.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium">Como funciona:</h4>
          <ol className="list-decimal pl-5 text-muted-foreground space-y-1">
            <li>Conecte as contas master e seguidora usando suas respectivas chaves de API</li>
            <li>Clique em "Iniciar Monitoramento" para começar a escutar as operações via WebSocket</li>
            <li>Quando uma ordem for executada na conta master, ela será detectada e replicada na conta seguidora</li>
            <li>O histórico de operações será exibido na tabela de resultados</li>
          </ol>
        </div>
        
        <div className="bg-yellow-100/20 border border-yellow-200 p-3 rounded-lg">
          <h4 className="font-medium text-yellow-800">Importante:</h4>
          <ul className="list-disc pl-5 text-yellow-800/80 space-y-1">
            <li>Recomendamos usar o ambiente de testes (Testnet) para testar o sistema antes de usar com fundos reais</li>
            <li>Verifique se suas chaves de API têm as permissões necessárias: Leitura (para a conta master) e Leitura + Escrita (para a conta seguidora)</li>
            <li>O sistema replica apenas operações de futuros perpétuos (USDT Perpetual)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemInfo;
