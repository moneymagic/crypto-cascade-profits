import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExchangeProps {
  name: string;
  logo: string;
  connected: boolean;
  apiHealth?: "good" | "warning" | "error";
}

const exchanges: ExchangeProps[] = [
  {
    name: "Bybit",
    logo: "By",
    connected: false
  }
];

function Exchange({ name, logo, connected, apiHealth }: ExchangeProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-primary/20 text-primary flex items-center justify-center font-bold">
          {logo}
        </div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="flex items-center gap-2">
            {connected ? (
              <>
                <Badge variant="outline" className="border-crypto-green text-crypto-green">
                  Conectado
                </Badge>
                {apiHealth && (
                  <Badge
                    variant="outline"
                    className={`${
                      apiHealth === "good"
                        ? "border-crypto-green text-crypto-green"
                        : apiHealth === "warning"
                        ? "border-crypto-yellow text-crypto-yellow"
                        : "border-crypto-red text-crypto-red"
                    }`}
                  >
                    API {apiHealth === "good" ? "OK" : apiHealth === "warning" ? "Limitada" : "Erro"}
                  </Badge>
                )}
              </>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                Não conectado
              </Badge>
            )}
          </div>
        </div>
      </div>
      <Button variant={connected ? "outline" : "default"} size="sm">
        {connected ? "Gerenciar" : "Conectar"}
      </Button>
    </div>
  );
}

export function ExchangeConnections() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conexões com Corretoras</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {exchanges.map((exchange) => (
          <Exchange key={exchange.name} {...exchange} />
        ))}
        
        <div className="text-sm text-muted-foreground mt-4">
          Conecte sua conta da Bybit para começar a copiar traders ou se tornar um master trader.
        </div>
      </CardContent>
    </Card>
  );
}
