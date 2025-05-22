
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AccountBalancesProps {
  masterBalance: number | null;
  followerBalance: number | null;
  onRefreshBalances?: () => void;
  isLoading?: boolean;
}

const AccountBalances: React.FC<AccountBalancesProps> = ({ 
  masterBalance, 
  followerBalance,
  onRefreshBalances,
  isLoading = false
}) => {
  if (masterBalance === null && followerBalance === null && !isLoading) {
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
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Atualizando..." : "Atualizar Saldos"}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg bg-secondary/20">
          <div className="text-sm text-muted-foreground">Saldo Master (USDT)</div>
          {isLoading ? (
            <div className="h-6 animate-pulse bg-secondary rounded w-24 mt-1"></div>
          ) : (
            <div className="text-xl font-semibold">
              {masterBalance !== null ? masterBalance.toFixed(2) : "0.00"}
            </div>
          )}
        </div>
        <div className="p-4 rounded-lg bg-secondary/20">
          <div className="text-sm text-muted-foreground">Saldo Seguidor (USDT)</div>
          {isLoading ? (
            <div className="h-6 animate-pulse bg-secondary rounded w-24 mt-1"></div>
          ) : (
            <div className="text-xl font-semibold">
              {followerBalance !== null ? followerBalance.toFixed(2) : "0.00"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountBalances;
