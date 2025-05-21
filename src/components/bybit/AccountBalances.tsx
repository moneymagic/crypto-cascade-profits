
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AccountBalancesProps {
  masterBalance: number | null;
  followerBalance: number | null;
  onRefreshBalances?: () => void;
}

const AccountBalances: React.FC<AccountBalancesProps> = ({ 
  masterBalance, 
  followerBalance,
  onRefreshBalances
}) => {
  if (masterBalance === null && followerBalance === null) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Saldos das Contas (Futuros Perpétuos)</h3>
        {onRefreshBalances && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefreshBalances}
            className="gap-2"
          >
            <RefreshCw size={14} />
            Atualizar Saldos
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {masterBalance !== null && (
          <div className="p-4 rounded-lg bg-secondary/20">
            <div className="text-sm text-muted-foreground">Saldo Master (USDT)</div>
            <div className="text-xl font-semibold">{masterBalance.toFixed(2)}</div>
          </div>
        )}
        {followerBalance !== null && (
          <div className="p-4 rounded-lg bg-secondary/20">
            <div className="text-sm text-muted-foreground">Saldo Seguidor (USDT)</div>
            <div className="text-xl font-semibold">{followerBalance.toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountBalances;
