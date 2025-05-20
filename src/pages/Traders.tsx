
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const traders = [
  {
    id: "1",
    name: "Carlos Almeida",
    avatar: "",
    winRate: "78%",
    followers: "1.2K",
    profit30d: "+32.5%",
    profit90d: "+87.3%",
    positive: true,
    verified: true,
    specialization: "BTC/ETH",
    description: "Trader especializado em Bitcoin e Ethereum com mais de 5 anos de experiência.",
  },
  {
    id: "2",
    name: "Daniela Santos",
    avatar: "",
    winRate: "67%",
    followers: "856",
    profit30d: "+18.3%",
    profit90d: "+52.8%",
    positive: true,
    verified: true,
    specialization: "Altcoins",
    description: "Foco em altcoins com potencial de crescimento e análise fundamentalista.",
  },
  {
    id: "3",
    name: "Fernando Costa",
    avatar: "",
    winRate: "72%",
    followers: "943",
    profit30d: "+24.7%",
    profit90d: "+61.5%",
    positive: true,
    verified: false,
    specialization: "NFT Tokens",
    description: "Especialista em tokens relacionados ao mercado de NFT e metaverso.",
  },
  {
    id: "4",
    name: "Márcia Oliveira",
    avatar: "",
    winRate: "81%",
    followers: "2.5K",
    profit30d: "+41.2%",
    profit90d: "+105.7%",
    positive: true,
    verified: true,
    specialization: "DeFi",
    description: "Estratégias em DeFi, yield farming e staking com resultados consistentes.",
  },
  {
    id: "5",
    name: "Roberto Mendes",
    avatar: "",
    winRate: "64%",
    followers: "721",
    profit30d: "+15.8%",
    profit90d: "+37.2%",
    positive: true,
    verified: false,
    specialization: "Swing Trading",
    description: "Trader de swing trading com base em análise técnica e indicadores.",
  },
  {
    id: "6",
    name: "Ana Clara Silva",
    avatar: "",
    winRate: "75%",
    followers: "1.1K",
    profit30d: "+28.2%",
    profit90d: "+71.9%",
    positive: true,
    verified: true,
    specialization: "Scalping",
    description: "Especialista em scalping com operações de curta duração e alto volume.",
  }
];

const Traders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTraders = traders.filter(trader => 
    trader.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    trader.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Tabs defaultValue="profit30d">
            <TabsList>
              <TabsTrigger value="profit30d">30 dias</TabsTrigger>
              <TabsTrigger value="profit90d">90 dias</TabsTrigger>
              <TabsTrigger value="followers">Seguidores</TabsTrigger>
              <TabsTrigger value="winRate">Win Rate</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTraders.map((trader) => (
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
                
                <div className="flex items-center justify-between mt-6">
                  <Button variant="outline" size="sm">Ver perfil</Button>
                  <Button size="sm">Copiar Trader</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Traders;
