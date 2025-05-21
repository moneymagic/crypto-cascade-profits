
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Link as LinkIcon, WifiHigh } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LevelProps {
  level: number;
  rank: string;
  bonusRate: string;
  progress: number;
  target: string;
  earned: string;
  requiredReferrals?: string;
  networkProfit?: string;
  activeReferrals?: number;
  totalReferrals?: number;
  maxPotential?: string;
}

const levels: LevelProps[] = [
  {
    level: 1,
    rank: "V1",
    bonusRate: "4%",
    progress: 100,
    target: "Cadastro",
    earned: "$40",
    requiredReferrals: "Nenhum",
    networkProfit: "$0",
    activeReferrals: 3,
    totalReferrals: 3,
    maxPotential: "$40"
  },
  {
    level: 2,
    rank: "V2",
    bonusRate: "5%",
    progress: 65,
    target: "$1.000",
    earned: "$50",
    requiredReferrals: "Nenhum",
    networkProfit: "$650",
    activeReferrals: 2,
    totalReferrals: 5,
    maxPotential: "$50"
  },
  {
    level: 3,
    rank: "V3",
    bonusRate: "6%",
    progress: 20,
    target: "$3.000",
    earned: "$18",
    requiredReferrals: "2 indicados V2",
    networkProfit: "$600",
    activeReferrals: 0,
    totalReferrals: 2,
    maxPotential: "$60"
  },
  {
    level: 4,
    rank: "V4",
    bonusRate: "7%",
    progress: 5,
    target: "$10.000",
    earned: "$0",
    requiredReferrals: "2 indicados V3",
    networkProfit: "$500",
    activeReferrals: 0,
    totalReferrals: 0,
    maxPotential: "$70"
  },
  {
    level: 5,
    rank: "V5",
    bonusRate: "8%",
    progress: 0,
    target: "$30.000",
    earned: "$0",
    requiredReferrals: "3 indicados V4",
    networkProfit: "$0",
    activeReferrals: 0,
    totalReferrals: 0,
    maxPotential: "$80"
  },
  {
    level: 6,
    rank: "V6",
    bonusRate: "9%",
    progress: 0,
    target: "$100.000",
    earned: "$0",
    requiredReferrals: "3 indicados V5",
    networkProfit: "$0",
    activeReferrals: 0,
    totalReferrals: 0,
    maxPotential: "$90"
  },
  {
    level: 7,
    rank: "V7",
    bonusRate: "10%",
    progress: 0,
    target: "$300.000",
    earned: "$0",
    requiredReferrals: "3 indicados V6",
    networkProfit: "$0",
    activeReferrals: 0,
    totalReferrals: 0,
    maxPotential: "$100"
  },
  {
    level: 8,
    rank: "V8",
    bonusRate: "11%",
    progress: 0,
    target: "$1.000.000",
    earned: "$0",
    requiredReferrals: "3 indicados V7",
    networkProfit: "$0",
    activeReferrals: 0,
    totalReferrals: 0,
    maxPotential: "$110"
  }
];

const referrals = [
  {
    id: "r1",
    name: "João Silva",
    avatar: "",
    rank: "V1",
    date: "2025-03-15",
    profit: "$120.50",
    bonus: "$4.82",
    status: "active",
    referrals: 3
  },
  {
    id: "r2",
    name: "Ana Paula",
    avatar: "",
    rank: "V1",
    date: "2025-04-02",
    profit: "$85.30",
    bonus: "$3.41",
    status: "active",
    referrals: 2
  },
  {
    id: "r3",
    name: "Ricardo Gomes",
    avatar: "",
    rank: "V2",
    date: "2025-04-18",
    profit: "$210.75",
    bonus: "$1.05",
    status: "active",
    referrals: 0
  },
  {
    id: "r4",
    name: "Luciana Costa",
    avatar: "",
    rank: "V1",
    date: "2025-03-22",
    profit: "$56.40",
    bonus: "$2.26",
    status: "active",
    referrals: 1
  },
];

function BonusLevel({ level, rank, bonusRate, progress, target, earned, requiredReferrals, networkProfit, activeReferrals, totalReferrals, maxPotential }: LevelProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-crypto-blue to-crypto-purple flex items-center justify-center text-white font-medium">
            {rank}
          </div>
          <div>
            <div className="font-medium">Nível {level} ({rank})</div>
            <div className="text-xs text-muted-foreground">Taxa de bônus: {bonusRate}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium text-crypto-green">{earned}</div>
          <div className="text-xs text-muted-foreground">Meta: {target}</div>
        </div>
      </div>
      <Progress value={progress} className="h-2" indicatorClassName="bg-gradient-to-r from-[#3772FF] to-[#8E33FF]" />
      <div className="flex justify-between text-xs text-muted-foreground pt-1">
        <div>Requisito: {requiredReferrals}</div>
        {networkProfit && <div>Lucro na Rede: {networkProfit}</div>}
      </div>
      {(activeReferrals !== undefined && totalReferrals !== undefined && maxPotential) && (
        <div className="flex justify-between text-xs text-muted-foreground pt-1">
          <div>Referidos: {totalReferrals} (ativos: {activeReferrals})</div>
          <div>Potencial máximo: {maxPotential}</div>
        </div>
      )}
    </div>
  );
}

const Network = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://vastcopy.com/ref/yourUsername";
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link copiado!",
      description: "Link de indicação copiado para a área de transferência.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <WifiHigh className="h-8 w-8" /> 
          Rede de Indicações
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border shadow-md">
            <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Seu Link de Indicação
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input 
                  value={referralLink} 
                  readOnly 
                  className="bg-secondary/20"
                />
                <Button 
                  variant="outline"
                  onClick={copyToClipboard} 
                  className={copied ? "text-green-500" : ""}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Compartilhe este link para convidar amigos para a VastCopy. 
                Você ganhará bônus por cada amigo que se registrar e começar a operar.
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                  <div>
                    <div className="text-sm text-muted-foreground">Total de indicados</div>
                    <div className="text-2xl font-bold">12</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Indicados ativos</div>
                    <div className="text-2xl font-bold">8</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-md">
            <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
              <CardTitle>Ganhos Totais</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-secondary/20 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Total ganho em bônus</div>
                  <div className="text-2xl font-bold text-crypto-green">$108.00</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Seu ranking atual</div>
                  <div className="text-2xl font-bold">V2</div>
                </div>
              </div>
              
              <Button className="w-full">Sacar Ganhos</Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border shadow-md">
          <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
            <CardTitle>Rede de Bônus Multinível</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <Tabs defaultValue="levels">
              <TabsList className="mb-4">
                <TabsTrigger value="levels">Níveis</TabsTrigger>
                <TabsTrigger value="how-it-works">Como Funciona</TabsTrigger>
                <TabsTrigger value="table-ranks">Tabela de Rankings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="levels">
                <div className="space-y-4">
                  {levels.slice(0, 4).map((level) => (
                    <BonusLevel key={level.level} {...level} />
                  ))}
                  <Button variant="outline" size="sm" className="mt-4">Ver todos os níveis</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="how-it-works">
                <div className="space-y-4 p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold mb-2">Como Funciona o Sistema de Comissões</h3>
                    <p className="text-sm">
                      O sistema cobra 30% do lucro líquido de cada operação bem-sucedida, distribuídos da seguinte forma:
                    </p>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      <li>10% vai para o Master Trader que criou a estratégia</li>
                      <li>20% é distribuído na rede multinível (V1 ao V8)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Distribuição dos 20% na Rede</h3>
                    <p className="text-sm">
                      O sistema usa o modelo de "Recompensa por diferença de ranking". Cada usuário recebe a diferença 
                      entre seu percentual e o percentual do maior ranking direto abaixo dele.
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Exemplo:</span> Se um usuário V6 (9%) tiver abaixo dele um V4 (7%), 
                      ele recebe 2%. Se tiver abaixo um V7 (10%), ele não recebe nada daquela linha.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="table-ranks">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Ranking</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Percentual Máx.</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Lucro Total na Rede</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Indicados Necessários</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="px-4 py-3 font-medium">V1</td>
                        <td className="px-4 py-3">4%</td>
                        <td className="px-4 py-3">Cadastro</td>
                        <td className="px-4 py-3">Nenhum</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">V2</td>
                        <td className="px-4 py-3">5%</td>
                        <td className="px-4 py-3">$1.000</td>
                        <td className="px-4 py-3">Nenhum</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">V3</td>
                        <td className="px-4 py-3">6%</td>
                        <td className="px-4 py-3">$3.000</td>
                        <td className="px-4 py-3">2 indicados V2</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">V4</td>
                        <td className="px-4 py-3">7%</td>
                        <td className="px-4 py-3">$10.000</td>
                        <td className="px-4 py-3">2 indicados V3</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">V5</td>
                        <td className="px-4 py-3">8%</td>
                        <td className="px-4 py-3">$30.000</td>
                        <td className="px-4 py-3">3 indicados V4</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">V6</td>
                        <td className="px-4 py-3">9%</td>
                        <td className="px-4 py-3">$100.000</td>
                        <td className="px-4 py-3">3 indicados V5</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">V7</td>
                        <td className="px-4 py-3">10%</td>
                        <td className="px-4 py-3">$300.000</td>
                        <td className="px-4 py-3">3 indicados V6</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">V8</td>
                        <td className="px-4 py-3">11%</td>
                        <td className="px-4 py-3">$1.000.000</td>
                        <td className="px-4 py-3">3 indicados V7</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Seus Referidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="direct">
              <TabsList className="mb-6">
                <TabsTrigger value="direct">Diretos (Nível 1)</TabsTrigger>
                <TabsTrigger value="all">Todos os Níveis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="direct">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Nome</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Ranking</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Data</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Lucros</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Seu Bônus</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Referidos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {referrals.map((referral) => (
                        <tr key={referral.id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={referral.avatar} />
                                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                  {referral.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              {referral.name}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{referral.rank}</td>
                          <td className="px-4 py-3 text-sm">{referral.date}</td>
                          <td className="px-4 py-3 text-sm text-crypto-green">{referral.profit}</td>
                          <td className="px-4 py-3 text-sm text-crypto-green">{referral.bonus}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-crypto-green"></span>
                              Ativo
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{referral.referrals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="all">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Nome</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Ranking</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Nível</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Data</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Lucros</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Seu Bônus</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {/* Exemplo de dados para todos os níveis */}
                      <tr>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">JS</AvatarFallback>
                            </Avatar>
                            João Silva
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">V1</td>
                        <td className="px-4 py-3 text-sm">1</td>
                        <td className="px-4 py-3 text-sm">15/03/2025</td>
                        <td className="px-4 py-3 text-sm text-crypto-green">$120.50</td>
                        <td className="px-4 py-3 text-sm text-crypto-green">$4.82</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-crypto-green"></span>
                            Ativo
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">MC</AvatarFallback>
                            </Avatar>
                            Maria Costa
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">V1</td>
                        <td className="px-4 py-3 text-sm">2</td>
                        <td className="px-4 py-3 text-sm">18/04/2025</td>
                        <td className="px-4 py-3 text-sm text-crypto-green">$85.20</td>
                        <td className="px-4 py-3 text-sm text-crypto-green">$0.85</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-crypto-green"></span>
                            Ativo
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Network;
