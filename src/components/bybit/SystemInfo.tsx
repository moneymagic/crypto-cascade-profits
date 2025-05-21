
import React from 'react';

const SystemInfo: React.FC = () => {
  return (
    <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
      <div>
        <h3 className="font-semibold mb-2">Como Funciona o Copy Trading Real</h3>
        <p className="text-sm">
          Este sistema permite conectar duas contas Bybit para replicar trades em tempo real:
        </p>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
          <li>Conecte uma conta como Master Trader (que cria as ordens originais)</li>
          <li>Conecte outra conta como Seguidor (que recebe as ordens replicadas)</li>
          <li>Execute operações na conta Master e veja elas sendo replicadas automaticamente</li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Permissões de API Necessárias</h3>
        <p className="text-sm">
          Para este sistema funcionar, você precisa criar API Keys na Bybit com as seguintes permissões:
        </p>
        <ul className="list-disc list-inside text-sm mt-2">
          <li>Leitura (Account & Orders)</li>
          <li>Escrita (Orders)</li>
          <li>Sem permissão de saque (por segurança)</li>
        </ul>
        <p className="text-sm mt-2">
          Recomendamos usar o Testnet para testes, que permite operar com saldo virtual.
        </p>
      </div>
    </div>
  );
};

export default SystemInfo;
