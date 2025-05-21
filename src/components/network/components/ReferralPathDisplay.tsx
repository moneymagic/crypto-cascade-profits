
import React from "react";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockReferralData } from "../data/mockReferralData";

interface ReferralPathDisplayProps {
  path: string[];
}

export const ReferralPathDisplay: React.FC<ReferralPathDisplayProps> = ({ path }) => {
  if (path.length === 0) return null;
  
  return (
    <div className="mt-8">
      <h3 className="font-medium mb-3">Caminho da indicação</h3>
      <div className="flex flex-wrap items-center gap-2 bg-muted p-4 rounded-md">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/20 text-primary text-xs">
            VC
          </AvatarFallback>
        </Avatar>
        <span>Você</span>
        
        {path.map((p, i) => {
          const user = i === 0 
            ? mockReferralData.root.find(u => u.id === p) 
            : mockReferralData[path[i-1]].find(u => u.id === p);
            
          return user ? (
            <React.Fragment key={p}>
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
              
              <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-md">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
                <Badge variant="outline" className="bg-vastcopy-navy/10 ml-1">
                  {user.rank}
                </Badge>
              </div>
            </React.Fragment>
          ) : null;
        })}
      </div>
    </div>
  );
};
