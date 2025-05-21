
import React from "react";
import { ChevronRight } from "lucide-react";
import { mockReferralData } from "../data/mockReferralData";

interface ReferralBreadcrumbProps {
  path: string[];
}

export const ReferralBreadcrumb: React.FC<ReferralBreadcrumbProps> = ({ path }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Você</span>
      {path.map((p, i) => (
        <div key={i} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>
            {mockReferralData.root.find(u => u.id === p)?.name || 
              mockReferralData[path[i-1]]?.find(u => u.id === p)?.name || 
              p}
          </span>
        </div>
      ))}
    </div>
  );
};
