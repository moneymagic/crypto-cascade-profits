
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTraderStore } from "@/lib/traderStore";
import { RefreshCw } from "lucide-react";
import { useTraderMetricsUpdate } from "@/hooks/useTraderMetricsUpdate";

export function MasterTradersList() {
  const allTraders = useTraderStore((state) => state.traders);
  const { isUpdating, updateNow } = useTraderMetricsUpdate();
  
  // Get the top 4 traders based on profit30d
  const featuredTraders = useMemo(() => {
    return [...allTraders]
      .sort((a, b) => {
        // Sort by profit30d (descending)
        const profitA = parseFloat(a.profit30d.replace(/%/g, ""));
        const profitB = parseFloat(b.profit30d.replace(/%/g, ""));
        return profitB - profitA;
      })
      .slice(0, 4); // Take only the first 4 traders
  }, [allTraders]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Master Traders em Destaque</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={updateNow} 
            disabled={isUpdating}
            title="Atualizar métricas"
          >
            <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
          </Button>
          <Link to="/traders">
            <Button variant="link" size="sm">Ver Todos</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {featuredTraders.map((trader) => (
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
                    {trader.isUserSubmitted && (
                      <Badge variant="outline" className="border-crypto-green text-crypto-green text-xs">
                        Novo
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
