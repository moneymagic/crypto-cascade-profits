import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTotalEarnings } from "@/lib/database";

// Adding the proper TypeScript interface for props
interface MultiLevelBonusProps {
  userId?: string;
}

export const MultiLevelBonus: React.FC<MultiLevelBonusProps> = ({ userId }) => {
  const [bonusData, setBonusData] = useState({
    masterBonus: 0,
    level1Bonus: 0,
    level2Bonus: 0,
    level3Bonus: 0,
  });

  useEffect(() => {
    async function loadBonusData() {
      if (!userId) return;
      
      try {
        // Get earnings data
        const earnings = await getTotalEarnings(userId);
        
        // Set bonus data with actual values
        setBonusData({
          masterBonus: earnings.master || 0,
          level1Bonus: (earnings.referral || 0) * 0.6, // Level 1 is 60% of total referral bonus
          level2Bonus: (earnings.referral || 0) * 0.3, // Level 2 is 30% of total referral bonus
          level3Bonus: (earnings.referral || 0) * 0.1, // Level 3 is 10% of total referral bonus
        });
      } catch (error) {
        console.error("Error loading bonus data:", error);
      }
    }
    
    loadBonusData();
  }, [userId]);

  return (
    <Card className="border shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
        <CardTitle>Bônus Multilevel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Bônus Master</div>
            <div className="text-lg font-bold text-crypto-green">${bonusData.masterBonus.toFixed(2)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Bônus Nível 1</div>
            <div className="text-lg font-bold text-crypto-green">${bonusData.level1Bonus.toFixed(2)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Bônus Nível 2</div>
            <div className="text-lg font-bold text-crypto-green">${bonusData.level2Bonus.toFixed(2)}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Bônus Nível 3</div>
            <div className="text-lg font-bold text-crypto-green">${bonusData.level3Bonus.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
