
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TradeResult } from './types';

interface TradeResultsProps {
  tradeResults: TradeResult[];
}

const TradeResults: React.FC<TradeResultsProps> = ({ tradeResults }) => {
  // Formatar data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data/Hora</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Origem</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Par</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Direção</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Quantidade</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Preço</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tradeResults.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                  Nenhuma operação realizada ainda. Conecte as contas e execute uma operação ou inicie o monitoramento automático.
                </td>
              </tr>
            ) : (
              tradeResults.map(result => (
                <tr key={result.id}>
                  <td className="px-4 py-3 text-sm">{formatDate(result.timestamp)}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="outline" className={result.id.startsWith('master') ? 'border-primary text-primary' : 'border-crypto-blue text-crypto-blue'}>
                      {result.id.startsWith('master') ? 'Master' : 'Seguidor'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant={result.source === 'WebSocket' ? 'secondary' : 'default'} className="text-xs">
                      {result.source === 'WebSocket' ? 'Automático' : 'Manual'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">{result.symbol}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant={result.side === 'Buy' ? 'default' : 'destructive'}>
                      {result.side === 'Buy' ? 'Compra' : 'Venda'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">{result.quantity}</td>
                  <td className="px-4 py-3 text-sm">{result.price}</td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="outline" className="border-crypto-green text-crypto-green">
                      {result.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeResults;
