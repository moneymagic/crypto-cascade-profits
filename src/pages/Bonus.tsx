
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const bonusLevels = [
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

function BonusLevel({ level, rank, bonusRate, progress, target, earned, requiredReferrals, networkProfit, activeReferrals, totalReferrals, maxPotential }) {
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
        <div>Lucro na Rede: {networkProfit}</div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground pt-1">
        <div>Referidos: {totalReferrals} (ativos: {activeReferrals})</div>
        <div>Potencial máximo: {maxPotential}</div>
      </div>
    </div>
  );
}

const Bonus = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Rede de Bônus Multinível</h1>
        <p className="text-muted-foreground">
          Ganhe até 11% de comissão da rede com o sistema multinível baseado em performance e volume de lucro.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total ganho em bônus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-crypto-green">$108.00</div>
              <div className="text-sm text-muted-foreground mt-1">Desde o início</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Seu ranking atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">V2</div>
              <div className="text-sm text-muted-foreground mt-1">5% de comissão</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total de referidos na rede</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">10</div>
              <div className="text-sm text-muted-foreground mt-1">Em todos os níveis</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Comissão por Diferença de Ranking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                Você ganha a diferença entre seu percentual e o percentual do maior ranking direto abaixo de você.
              </p>
              <p className="text-sm mt-2">
                <span className="font-medium">Exemplo:</span> Se você é V6 (9%) e tem abaixo um V4 (7%), você recebe 2% de comissão.
                Se tiver abaixo um V7 (10%), não recebe nada daquela linha.
              </p>
            </div>
            
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
            
            <div className="text-sm text-muted-foreground pt-4">
              Os percentuais são cumulativos na rede até no máximo 20% da comissão da plataforma.
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Seus Níveis e Bônus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {bonusLevels.slice(0, 4).map((level) => (
              <BonusLevel key={level.level} {...level} />
            ))}
            
            <div className="text-sm text-muted-foreground pt-4">
              Convide mais traders e aumente o volume de lucro na sua rede para subir de ranking!
            </div>
            
            <div className="pt-2">
              <Button>Gerar Link de Convite</Button>
            </div>
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

export default Bonus;
