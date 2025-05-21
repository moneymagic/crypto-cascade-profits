
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTraderStore, TraderData } from "@/lib/traderStore";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

const Traders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("profit30d");
  const [displayTraders, setDisplayTraders] = useState<TraderData[]>([]);
  
  const { user } = useAuth();
  const fetchTraders = useTraderStore((state) => state.fetchTraders);
  const traders = useTraderStore((state) => state.traders);
  const loading = useTraderStore((state) => state.loading);

  // Carregar traders do Supabase quando o componente montar
  const { refetch } = useQuery({
    queryKey: ['traders'],
    queryFn: fetchTraders,
    enabled: !!user, // Só buscar traders quando o usuário estiver logado
  });

  useEffect(() => {
    // Filter traders
    const filtered = traders.filter(
      (trader) =>
        trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort traders
    const sorted = [...filtered].sort((a, b) => {
      switch (sortType) {
        case "profit30d":
          return parseFloat(String(a.profit30d).replace(/%|\+/g, "")) > 
                 parseFloat(String(b.profit30d).replace(/%|\+/g, "")) ? -1 : 1;
        case "profit90d":
          return parseFloat(String(a.profit90d).replace(/%|\+/g, "")) > 
                 parseFloat(String(b.profit90d).replace(/%|\+/g, "")) ? -1 : 1;
        case "followers":
          // Handle both string and number formats for followers
          const followersA = typeof a.followers === 'string' && a.followers.includes("K")
            ? parseFloat(a.followers.replace("K", "")) * 1000
            : typeof a.followers === 'string' 
              ? parseFloat(a.followers) 
              : a.followers;
          const followersB = typeof b.followers === 'string' && b.followers.includes("K")
            ? parseFloat(b.followers.replace("K", "")) * 1000
            : typeof b.followers === 'string' 
              ? parseFloat(b.followers) 
              : b.followers;
          return Number(followersB) - Number(followersA);
        case "winRate":
          return parseFloat(String(a.winRate).replace(/%/g, "")) > 
                 parseFloat(String(b.winRate).replace(/%/g, "")) ? -1 : 1;
        default:
          return 0;
      }
    });

    setDisplayTraders(sorted);
  }, [traders, searchTerm, sortType]);

  // Function to safely format follower count
  const formatFollowers = (followers: string | number): string => {
    if (typeof followers === 'number') {
      return followers.toLocaleString();
    }
    return String(followers);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Master Traders</h1>
        <p className="text-muted-foreground">
          Escolha os melhores traders para seguir e copiar automaticamente suas operações.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Input
            placeholder="Buscar traders por nome ou especialização..."
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Tabs defaultValue={sortType} onValueChange={setSortType}>
            <TabsList>
              <TabsTrigger value="profit30d">30 dias</TabsTrigger>
              <TabsTrigger value="profit90d">90 dias</TabsTrigger>
              <TabsTrigger value="followers">Seguidores</TabsTrigger>
              <TabsTrigger value="winRate">Win Rate</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-crypto-blue to-crypto-purple opacity-50" />
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-muted"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-muted rounded"></div>
                        <div className="h-3 w-16 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                      <div>
                        <div className="h-3 w-12 mx-auto bg-muted rounded mb-1"></div>
                        <div className="h-4 w-10 mx-auto bg-muted rounded"></div>
                      </div>
                      <div>
                        <div className="h-3 w-12 mx-auto bg-muted rounded mb-1"></div>
                        <div className="h-4 w-10 mx-auto bg-muted rounded"></div>
                      </div>
                      <div>
                        <div className="h-3 w-12 mx-auto bg-muted rounded mb-1"></div>
                        <div className="h-4 w-10 mx-auto bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-muted rounded"></div>
                    <div className="h-3 w-3/4 bg-muted rounded"></div>
                    <div className="flex items-center justify-center mt-6">
                      <div className="h-8 w-20 bg-muted rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayTraders.length > 0 ? (
              displayTraders.map((trader) => (
                <Card key={trader.id} className="overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-crypto-blue to-crypto-purple" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={trader.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xl">
                          {trader.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-lg flex items-center gap-2">
                          {trader.name}
                          {trader.verified && (
                            <Badge variant="outline" className="border-crypto-blue text-crypto-blue">
                              Verificado
                            </Badge>
                          )}
                          {trader.isUserSubmitted && (
                            <Badge variant="outline" className="border-crypto-green text-crypto-green">
                              Novo
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{trader.specialization}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                        <div className="font-bold">{trader.winRate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Lucro 30d</div>
                        <div className={`font-bold ${trader.positive ? 'text-crypto-green' : 'text-crypto-red'}`}>
                          {trader.profit30d}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Seguidores</div>
                        <div className="font-bold">{formatFollowers(trader.followers)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-muted-foreground">
                      {trader.description}
                    </div>
                    
                    <div className="flex items-center justify-center mt-6">
                      <Link to={`/trader/${trader.id}`}>
                        <Button size="sm">Ver perfil</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Nenhum trader encontrado com os critérios de busca.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Traders;
