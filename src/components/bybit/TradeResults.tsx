
import React from 'react';
import { TradeResult } from './types';
import { Badge } from "@/components/ui/badge";

interface TradeResultsProps {
  tradeResults: TradeResult[];
}

const TradeResults: React.FC<TradeResultsProps> = ({ tradeResults }) => {
  if (tradeResults.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma operação foi executada ainda. As operações aparecerão aqui quando forem detectadas e replicadas.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-xs text-muted-foreground">
            <th className="py-2 px-2 text-left">Símbolo</th>
            <th className="py-2 px-2 text-left">Lado</th>
            <th className="py-2 px-2 text-left">Quantidade</th>
            <th className="py-2 px-2 text-left">Preço</th>
            <th className="py-2 px-2 text-left">Status</th>
            <th className="py-2 px-2 text-left">Horário</th>
            <th className="py-2 px-2 text-left">Fonte</th>
          </tr>
        </thead>
        <tbody>
          {tradeResults.map((result) => (
            <tr key={result.id} className="border-b hover:bg-secondary/20">
              <td className="py-2 px-2">{result.symbol}</td>
              <td className="py-2 px-2">
                <Badge className={`${result.side === 'Buy' ? 'bg-crypto-green' : 'bg-crypto-red'} text-white`}>
                  {result.side === 'Buy' ? 'Compra' : 'Venda'}
                </Badge>
              </td>
              <td className="py-2 px-2">{result.quantity}</td>
              <td className="py-2 px-2">{result.price}</td>
              <td className="py-2 px-2">
                <Badge 
                  variant="outline" 
                  className={`
                    ${result.status === 'Replicada' ? 'border-crypto-green text-crypto-green' : 
                      result.status === 'Erro' ? 'border-crypto-red text-crypto-red' : 
                      'border-crypto-blue text-crypto-blue'}
                  `}
                >
                  {result.status}
                </Badge>
              </td>
              <td className="py-2 px-2 text-xs">
                {result.timestamp.toLocaleTimeString()}
              </td>
              <td className="py-2 px-2 text-xs">
                {result.source}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeResults;
