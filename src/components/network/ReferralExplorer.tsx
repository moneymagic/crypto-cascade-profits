
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users } from "lucide-react";
import { getReferrals } from "@/lib/database";
import { mockReferralData } from "./data/mockReferralData";
import { getReferralPath } from "./utils/referralUtils";
import { ReferralBreadcrumb } from "./components/ReferralBreadcrumb";
import { ReferralList } from "./components/ReferralList";
import { ReferralUserDetails } from "./components/ReferralUserDetails";
import { ReferralPathDisplay } from "./components/ReferralPathDisplay";
import { ReferralExplorerProps } from "./types/referralTypes";

export const ReferralExplorer: React.FC<ReferralExplorerProps> = ({ userId }) => {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [path, setPath] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadReferrals() {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const data = await getReferrals(userId);
        setReferrals(data);
      } catch (error) {
        console.error("Error loading referrals:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadReferrals();
  }, [userId]);

  const referralLevels = getReferralPath(path);
  const currentLevel = referralLevels[referralLevels.length - 1];
  
  const handleUserClick = (userId: string) => {
    if (mockReferralData[userId]) {
      setPath([...path, userId]);
      setSelectedUserId(null);
    } else {
      setSelectedUserId(userId);
    }
  };
  
  const handleBackClick = () => {
    if (path.length > 0) {
      setPath(path.slice(0, -1));
      setSelectedUserId(null);
    }
  };
  
  const handleResetClick = () => {
    setPath([]);
    setSelectedUserId(null);
  };
  
  const getActiveUser = () => {
    if (!selectedUserId || path.length === 0) return null;
    
    const currentLevelUsers = referralLevels[referralLevels.length - 1].users;
    return currentLevelUsers.find(user => user.id === selectedUserId) || null;
  };

  const activeUser = getActiveUser();
  
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Explorador de Rede
          </div>
          <div className="flex items-center gap-2">
            {path.length > 0 && (
              <>
                <Button size="sm" variant="ghost" onClick={handleBackClick} className="text-white hover:text-white hover:bg-white/20">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Button>
                <Button size="sm" variant="ghost" onClick={handleResetClick} className="text-white hover:text-white hover:bg-white/20">
                  Início
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <ReferralBreadcrumb path={path} />
        
        <div className="grid gap-6 md:grid-cols-2">
          <ReferralList 
            currentLevel={currentLevel}
            path={path}
            selectedUserId={selectedUserId}
            onUserClick={handleUserClick}
          />
          
          <ReferralUserDetails 
            activeUser={activeUser}
            onViewReferrals={handleUserClick}
          />
        </div>
        
        {path.length > 0 && referralLevels.length > 1 && (
          <ReferralPathDisplay path={path} />
        )}
      </CardContent>
    </Card>
  );
}
