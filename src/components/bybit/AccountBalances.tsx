
import React from 'react';

interface AccountBalancesProps {
  masterBalance: number | null;
  followerBalance: number | null;
}

const AccountBalances: React.FC<AccountBalancesProps> = ({ 
  masterBalance, 
  followerBalance 
}) => {
  if (masterBalance === null && followerBalance === null) {
    return null;
  }

  return (
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
  );
};

export default AccountBalances;
