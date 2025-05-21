
import React from "react";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ReferralBreadcrumbProps {
  path: string[];
}

export const ReferralBreadcrumb: React.FC<ReferralBreadcrumbProps> = ({ path }) => {
  const [userNames, setUserNames] = useState<Record<string, string>>({});

  useEffect(() => {
    // Buscar nomes dos usuários pelo ID
    const fetchUserNames = async () => {
      if (path.length === 0) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', path);
          
        if (error) throw error;
        
        const namesMap: Record<string, string> = {};
        data?.forEach(user => {
          namesMap[user.id] = user.full_name || `Usuário ${user.id.substring(0, 4)}`;
        });
        
        setUserNames(namesMap);
      } catch (err) {
        console.error("Erro ao buscar nomes dos usuários:", err);
      }
    };
    
    fetchUserNames();
  }, [path]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>Você</span>
      {path.map((p, i) => (
        <div key={i} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>
            {userNames[p] || `Usuário ${p.substring(0, 4)}`}
          </span>
        </div>
      ))}
    </div>
  );
};
