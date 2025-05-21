
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReferralLevel, ReferralUser } from "../types/referralTypes";

interface ReferralListProps {
  currentLevel: ReferralLevel;
  path: string[];
  selectedUserId: string | null;
  onUserClick: (userId: string) => void;
}

export const ReferralList: React.FC<ReferralListProps> = ({ 
  currentLevel, 
  path, 
  selectedUserId, 
  onUserClick 
}) => {
  const headerTitle = path.length === 0 
    ? "Seus indicados diretos" 
    : `Indicados de ${currentLevel.users[0]?.name || "usuário"}`;

  return (
    <div>
      <h3 className="font-medium mb-3">
        {headerTitle}
        <span className="text-muted-foreground text-sm ml-2">
          (Nível {currentLevel.level})
        </span>
      </h3>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Ranking</TableHead>
              <TableHead>Lucro</TableHead>
              <TableHead>Referidos</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentLevel.users.map(user => (
              <TableRow key={user.id} className={selectedUserId === user.id ? "bg-muted" : ""}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-vastcopy-navy/10">
                    {user.rank}
                  </Badge>
                </TableCell>
                <TableCell className="text-crypto-green">
                  {user.profit}
                </TableCell>
                <TableCell>{user.referrals}</TableCell>
                <TableCell>
                  <Button 
                    size="sm"
                    variant={user.referrals > 0 ? "default" : "outline"} 
                    onClick={() => onUserClick(user.id)}
                    disabled={user.referrals === 0}
                    className={user.referrals === 0 ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {user.referrals > 0 ? "Explorar" : "Sem indicados"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
