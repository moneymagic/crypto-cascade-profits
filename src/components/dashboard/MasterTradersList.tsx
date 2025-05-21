
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const traders = [
  {
    id: "1",
    name: "Carlos Almeida",
    avatar: "",
    winRate: "78%",
    followers: "1.2K",
    profit30d: "+32.5%",
    positive: true,
    verified: true,
    specialization: "BTC/ETH"
  },
  {
    id: "2",
    name: "Daniela Santos",
    avatar: "",
    winRate: "67%",
    followers: "856",
    profit30d: "+18.3%",
    positive: true,
    verified: true,
    specialization: "Altcoins"
  },
  {
    id: "3",
    name: "Fernando Costa",
    avatar: "",
    winRate: "72%",
    followers: "943",
    profit30d: "+24.7%",
    positive: true,
    verified: false,
    specialization: "NFT Tokens"
  },
  {
    id: "4",
    name: "Márcia Oliveira",
    avatar: "",
    winRate: "81%",
    followers: "2.5K",
    profit30d: "+41.2%",
    positive: true,
    verified: true,
    specialization: "DeFi"
  }
];

export function MasterTradersList() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Master Traders em Destaque</CardTitle>
        <Link to="/traders">
          <Button variant="link" size="sm">Ver Todos</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {traders.map((trader) => (
            <div 
              key={trader.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={trader.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {trader.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {trader.name}
                    {trader.verified && (
                      <Badge variant="outline" className="border-crypto-blue text-crypto-blue">
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{trader.specialization}</span>
                    <span className="text-xs">•</span>
                    <span>{trader.followers} seguidores</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className={`font-semibold ${trader.positive ? 'text-crypto-green' : 'text-crypto-red'}`}>
                    {trader.profit30d}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Win rate: {trader.winRate}
                  </div>
                </div>
                <div className="flex justify-center">
                  <Link to={`/trader/${trader.id}`}>
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
