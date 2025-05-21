import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getReferrals } from "@/lib/database";
import { ChevronRight, ChevronLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ReferralUser {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  profit: string;
  bonus: string;
  referrals: number;
  date: string;
  status: "active" | "inactive";
}

interface ReferralLevel {
  level: number;
  users: ReferralUser[];
}

// Sample data - in a real app, this would come from an API
const mockReferralData: Record<string, ReferralUser[]> = {
  "root": [
    {
      id: "r1",
      name: "João Silva",
      avatar: "",
      rank: "V1",
      profit: "$120.50",
      bonus: "$4.82",
      referrals: 3,
      date: "2025-03-15",
      status: "active"
    },
    {
      id: "r2",
      name: "Ana Paula",
      avatar: "",
      rank: "V1",
      profit: "$85.30",
      bonus: "$3.41",
      referrals: 2,
      date: "2025-04-02",
      status: "active"
    },
    {
      id: "r3",
      name: "Ricardo Gomes",
      avatar: "",
      rank: "V2",
      profit: "$210.75",
      bonus: "$10.54",
      referrals: 5,
      date: "2025-04-18",
      status: "active"
    },
    {
      id: "r4",
      name: "Luciana Costa",
      avatar: "",
      rank: "V1",
      profit: "$56.40",
      bonus: "$2.26",
      referrals: 1,
      date: "2025-03-22",
      status: "active"
    },
  ],
  "r1": [
    {
      id: "r1-1",
      name: "Carlos Oliveira",
      avatar: "",
      rank: "V1",
      profit: "$73.20",
      bonus: "$2.93",
      referrals: 0,
      date: "2025-03-20",
      status: "active"
    },
    {
      id: "r1-2",
      name: "Fernanda Alves",
      avatar: "",
      rank: "V1",
      profit: "$43.50",
      bonus: "$1.74",
      referrals: 2,
      date: "2025-03-25",
      status: "active"
    },
    {
      id: "r1-3",
      name: "Roberto Souza",
      avatar: "",
      rank: "V1",
      profit: "$15.75",
      bonus: "$0.63",
      referrals: 0,
      date: "2025-04-10",
      status: "active"
    }
  ],
  "r2": [
    {
      id: "r2-1",
      name: "Patricia Lima",
      avatar: "",
      rank: "V1",
      profit: "$38.25",
      bonus: "$1.53",
      referrals: 0,
      date: "2025-04-05",
      status: "active"
    },
    {
      id: "r2-2",
      name: "Daniel Santos",
      avatar: "",
      rank: "V1",
      profit: "$22.80",
      bonus: "$0.91",
      referrals: 0,
      date: "2025-04-08",
      status: "active"
    }
  ],
  "r3": [
    {
      id: "r3-1",
      name: "Mariana Ferreira",
      avatar: "",
      rank: "V2",
      profit: "$95.40",
      bonus: "$4.77",
      referrals: 3,
      date: "2025-04-20",
      status: "active"
    },
    {
      id: "r3-2",
      name: "Lucas Pereira",
      avatar: "",
      rank: "V1",
      profit: "$42.60",
      bonus: "$1.70",
      referrals: 0,
      date: "2025-04-22",
      status: "active"
    },
    {
      id: "r3-3",
      name: "Juliana Martins",
      avatar: "",
      rank: "V1",
      profit: "$53.90",
      bonus: "$2.16",
      referrals: 1,
      date: "2025-04-25",
      status: "active"
    },
    {
      id: "r3-4",
      name: "Paulo Rodrigues",
      avatar: "",
      rank: "V1",
      profit: "$28.75",
      bonus: "$1.15",
      referrals: 0,
      date: "2025-05-01",
      status: "active"
    },
    {
      id: "r3-5",
      name: "Camila Almeida",
      avatar: "",
      rank: "V1",
      profit: "$18.30",
      bonus: "$0.73",
      referrals: 0,
      date: "2025-05-05",
      status: "active"
    }
  ],
  "r4": [
    {
      id: "r4-1",
      name: "Felipe Costa",
      avatar: "",
      rank: "V1",
      profit: "$32.15",
      bonus: "$1.29",
      referrals: 0,
      date: "2025-03-30",
      status: "active"
    }
  ],
  "r1-2": [
    {
      id: "r1-2-1",
      name: "Gabriel Silva",
      avatar: "",
      rank: "V1",
      profit: "$25.40",
      bonus: "$1.02",
      referrals: 0,
      date: "2025-04-02",
      status: "active"
    },
    {
      id: "r1-2-2",
      name: "Isabela Santos",
      avatar: "",
      rank: "V1",
      profit: "$18.60",
      bonus: "$0.74",
      referrals: 0,
      date: "2025-04-05",
      status: "active"
    }
  ],
  "r3-1": [
    {
      id: "r3-1-1",
      name: "Eduardo Oliveira",
      avatar: "",
      rank: "V1",
      profit: "$48.30",
      bonus: "$1.93",
      referrals: 0,
      date: "2025-04-23",
      status: "active"
    },
    {
      id: "r3-1-2",
      name: "Bianca Lima",
      avatar: "",
      rank: "V1",
      profit: "$35.75",
      bonus: "$1.43",
      referrals: 0,
      date: "2025-04-26",
      status: "active"
    },
    {
      id: "r3-1-3",
      name: "Rodrigo Pereira",
      avatar: "",
      rank: "V1",
      profit: "$27.90",
      bonus: "$1.12",
      referrals: 0,
      date: "2025-04-30",
      status: "active"
    }
  ],
  "r3-3": [
    {
      id: "r3-3-1",
      name: "Vanessa Sousa",
      avatar: "",
      rank: "V1",
      profit: "$21.45",
      bonus: "$0.86",
      referrals: 0,
      date: "2025-04-28",
      status: "active"
    }
  ]
};

const getReferralPath = (path: string[]): ReferralLevel[] => {
  const result: ReferralLevel[] = [];
  
  // Root level
  if (path.length === 0) {
    result.push({
      level: 1,
      users: mockReferralData["root"]
    });
    return result;
  }
  
  // Build the path
  let currentPath = "root";
  result.push({
    level: 1,
    users: mockReferralData["root"]
  });
  
  for (let i = 0; i < path.length; i++) {
    const userId = path[i];
    currentPath = userId;
    
    if (mockReferralData[currentPath]) {
      result.push({
        level: i + 2, // Level starts at 1 for root
        users: mockReferralData[currentPath]
      });
    }
  }
  
  return result;
};

export const ReferralExplorer: React.FC<ReferralExplorerProps> = ({ userId }) => {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const [path, setPath] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
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
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-3">
              {path.length === 0 
                ? "Seus indicados diretos" 
                : `Indicados de ${mockReferralData.root.find(u => u.id === path[path.length-1])?.name || 
                    mockReferralData[path[path.length-2]]?.find(u => u.id === path[path.length-1])?.name || 
                    "usuário"}`}
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
                          onClick={() => handleUserClick(user.id)}
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
          
          <div>
            {activeUser ? (
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
                    onClick={() => handleUserClick(activeUser.id)}
                  >
                    Ver indicados de {activeUser.name.split(" ")[0]}
                  </Button>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border rounded-md p-8">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">Detalhes do indicado</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Selecione um indicado para visualizar mais informações sobre ele e sua rede.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {path.length > 0 && referralLevels.length > 1 && (
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
        )}
      </CardContent>
    </Card>
  );
}
