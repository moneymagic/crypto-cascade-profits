
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTraderStore, TraderData } from "@/lib/traderStore";

const Traders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("profit30d");
  const traders = useTraderStore((state) => state.traders);
  const [displayTraders, setDisplayTraders] = useState<TraderData[]>([]);

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
          return parseFloat(a.profit30d) > parseFloat(b.profit30d) ? -1 : 1;
        case "profit90d":
          return parseFloat(a.profit90d) > parseFloat(b.profit90d) ? -1 : 1;
        case "followers":
          // Convert K notation to numbers for proper sorting
          const followersA = a.followers.includes("K")
            ? parseFloat(a.followers.replace("K", "")) * 1000
            : parseFloat(a.followers);
          const followersB = b.followers.includes("K")
            ? parseFloat(b.followers.replace("K", "")) * 1000
            : parseFloat(b.followers);
          return followersB - followersA;
        case "winRate":
          return parseFloat(a.winRate) > parseFloat(b.winRate) ? -1 : 1;
        default:
          return 0;
      }
    });

    setDisplayTraders(sorted);
  }, [traders, searchTerm, sortType]);

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
                      <div className="font-bold">{trader.followers}</div>
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
      </div>
    </DashboardLayout>
  );
};

export default Traders;
