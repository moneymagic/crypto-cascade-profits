
import { BarChart, Info, WifiHigh } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RankingInfo {
  rank: string;
  bonusRate: string;
  requiredProfit: string;
  requiredReferrals: string;
}

const rankings: RankingInfo[] = [
  {
    rank: "V1",
    bonusRate: "4%",
    requiredProfit: "Cadastro",
    requiredReferrals: "Nenhum"
  },
  {
    rank: "V2",
    bonusRate: "5%",
    requiredProfit: "$1.000",
    requiredReferrals: "Nenhum"
  },
  {
    rank: "V3",
    bonusRate: "6%",
    requiredProfit: "$3.000",
    requiredReferrals: "2 indicados V2"
  },
  {
    rank: "V4",
    bonusRate: "7%",
    requiredProfit: "$10.000",
    requiredReferrals: "2 indicados V3"
  },
  {
    rank: "V5",
    bonusRate: "8%",
    requiredProfit: "$30.000",
    requiredReferrals: "3 indicados V4"
  },
  {
    rank: "V6",
    bonusRate: "9%",
    requiredProfit: "$100.000",
    requiredReferrals: "3 indicados V5"
  },
  {
    rank: "V7",
    bonusRate: "10%",
    requiredProfit: "$300.000",
    requiredReferrals: "3 indicados V6"
  },
  {
    rank: "V8",
    bonusRate: "11%",
    requiredProfit: "$1.000.000",
    requiredReferrals: "3 indicados V7"
  }
];

export function MultiLevelBonus() {
  return (
    <Card className="border shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <WifiHigh className="h-5 w-5" />
          Rede de Bônus Multinível
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Tabs defaultValue="how-it-works">
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="how-it-works">Como Funciona</TabsTrigger>
            <TabsTrigger value="table-ranks">Tabela de Rankings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="how-it-works">
            <div className="space-y-4">
              <div className="p-4 bg-secondary/20 rounded-lg space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-vastcopy-teal" />
                    Sistema de Comissões
                  </h3>
                  <p className="text-sm">
                    O sistema cobra 30% do lucro líquido de cada operação bem-sucedida, distribuídos da seguinte forma:
                  </p>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>10% vai para o Master Trader que criou a estratégia</li>
                    <li>20% é distribuído na rede multinível (V1 ao V8)</li>
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <WifiHigh className="h-5 w-5 text-vastcopy-teal" />
                    Bônus em Infinitos Níveis
                  </h3>
                  <p className="text-sm">
                    Diferente de sistemas tradicionais que limitam a profundidade de níveis, nosso programa permite 
                    que você ganhe em <span className="font-medium">profundidade infinita</span>, até que alguém na 
                    sua linha descendente tenha um ranking igual ou superior ao seu.
                  </p>
                  
                  <div className="bg-background p-3 rounded-md mt-3 border border-border">
                    <h4 className="font-medium text-sm mb-1">Exemplo:</h4>
                    <p className="text-sm">
                      Se você tem ranking V6 (9%), você receberá comissões de TODOS os traders abaixo de você, 
                      independente de quantos níveis existam, até encontrar alguém com ranking V6 ou superior.
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5 text-vastcopy-teal" />
                    Como Calcular seu Bônus
                  </h3>
                  <p className="text-sm">
                    Utilizamos o modelo de "Recompensa por diferença de ranking". Você recebe a diferença 
                    entre seu percentual e o percentual do maior ranking direto em sua linha descendente.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-vastcopy-teal/10 border border-vastcopy-teal/30 p-3 rounded-md">
                      <h5 className="font-medium text-sm mb-1 text-vastcopy-teal">Exemplo 1: Ganho máximo</h5>
                      <p className="text-xs">
                        <span className="font-medium">Se você é V6 (9%)</span> e um usuário na sua rede é V1 (4%),
                        você recebe <span className="font-medium">5% do lucro</span> deste usuário.
                      </p>
                    </div>
                    <div className="bg-vastcopy-purple/10 border border-vastcopy-purple/30 p-3 rounded-md">
                      <h5 className="font-medium text-sm mb-1 text-vastcopy-purple">Exemplo 2: Ganho parcial</h5>
                      <p className="text-xs">
                        <span className="font-medium">Se você é V6 (9%)</span> e um usuário na sua rede é V4 (7%),
                        você recebe <span className="font-medium">2% do lucro</span> deste usuário.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-vastcopy-navy/10 border border-vastcopy-navy/30 p-3 rounded-md">
                    <h5 className="font-medium text-sm mb-1 text-vastcopy-navy">Exemplo 3: Corte na comissão</h5>
                    <p className="text-xs">
                      <span className="font-medium">Se você é V6 (9%)</span> e um usuário na sua rede é V7 (10%) ou superior,
                      você <span className="font-medium">não recebe comissão</span> deste usuário nem de qualquer outro abaixo dele.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Seu ranking atual:</span> V2
                </div>
                <Button variant="outline" size="sm">
                  Como aumentar meu ranking?
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="table-ranks">
            <div className="overflow-x-auto border rounded-md">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Ranking</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      <div className="flex items-center gap-1">
                        Percentual Máx.
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">
                                Percentual máximo que você pode ganhar do lucro dos traders em sua rede
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      <div className="flex items-center gap-1">
                        Lucro Total na Rede
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">
                                Lucro acumulado gerado por toda sua rede de indicados
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      <div className="flex items-center gap-1">
                        Indicados Necessários
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">
                                Quantidade de indicados diretos com o ranking especificado
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rankings.map((rank, index) => (
                    <tr 
                      key={rank.rank} 
                      className={rank.rank === "V2" ? "bg-vastcopy-teal/10" : ""}
                    >
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          {rank.rank === "V2" && (
                            <div className="h-2 w-2 rounded-full bg-vastcopy-teal"></div>
                          )}
                          {rank.rank}
                        </div>
                      </td>
                      <td className="px-4 py-3">{rank.bonusRate}</td>
                      <td className="px-4 py-3">{rank.requiredProfit}</td>
                      <td className="px-4 py-3">{rank.requiredReferrals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-3 bg-muted/30 rounded-md text-sm text-muted-foreground">
              <strong>Nota:</strong> Para avançar para o próximo ranking, você precisa cumprir AMBOS os requisitos: 
              lucro total na rede E ter a quantidade necessária de indicados diretos com o ranking especificado.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
