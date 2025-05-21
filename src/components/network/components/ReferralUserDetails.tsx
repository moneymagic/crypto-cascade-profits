
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { ReferralUser } from "../types/referralTypes";

interface ReferralUserDetailsProps {
  activeUser: ReferralUser | null;
  onViewReferrals: (userId: string) => void;
}

export const ReferralUserDetails: React.FC<ReferralUserDetailsProps> = ({ 
  activeUser, 
  onViewReferrals 
}) => {
  if (!activeUser) {
    return (
      <div className="h-full flex items-center justify-center border rounded-md p-8">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg">Detalhes do indicado</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Selecione um indicado para visualizar mais informações sobre ele e sua rede.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={activeUser.avatar} alt={activeUser.name} />
          <AvatarFallback className="bg-primary/20 text-primary text-lg">
            {activeUser.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg">{activeUser.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-vastcopy-navy/10">
              {activeUser.rank}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Indicado em {activeUser.date}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="border rounded-md p-3">
          <div className="text-sm text-muted-foreground">Lucro total</div>
          <div className="text-lg font-medium text-crypto-green">{activeUser.profit}</div>
        </div>
        
        <div className="border rounded-md p-3">
          <div className="text-sm text-muted-foreground">Seu bônus</div>
          <div className="text-lg font-medium text-crypto-green">{activeUser.bonus}</div>
        </div>
        
        <div className="border rounded-md p-3">
          <div className="text-sm text-muted-foreground">Referidos diretos</div>
          <div className="text-lg font-medium">{activeUser.referrals}</div>
        </div>
        
        <div className="border rounded-md p-3">
          <div className="text-sm text-muted-foreground">Status</div>
          <div className="text-lg font-medium flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-crypto-green"></span>
            Ativo
          </div>
        </div>
      </div>
      
      {activeUser.referrals > 0 && (
        <Button 
          className="w-full mt-2" 
          onClick={() => onViewReferrals(activeUser.id)}
        >
          Ver indicados de {activeUser.name.split(" ")[0]}
        </Button>
      )}
    </div>
  );
};
