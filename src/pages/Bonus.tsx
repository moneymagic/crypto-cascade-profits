
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const bonusLevels = [
  {
    level: 1,
    bonusRate: "5%",
    progress: 100,
    target: "$1,000",
    earned: "$50",
    referrals: 5,
    active: 5,
    maxPotential: "$250"
  },
  {
    level: 2,
    bonusRate: "3%",
    progress: 65,
    target: "$5,000",
    earned: "$97.50",
    referrals: 8,
    active: 5,
    maxPotential: "$150"
  },
  {
    level: 3,
    bonusRate: "1%",
    progress: 20,
    target: "$10,000",
    earned: "$20",
    referrals: 12,
    active: 2,
    maxPotential: "$100"
  },
  {
    level: 4,
    bonusRate: "0.5%",
    progress: 5,
    target: "$20,000",
    earned: "$0",
    referrals: 0,
    active: 0,
    maxPotential: "$100"
  },
  {
    level: 5,
    bonusRate: "0.25%",
    progress: 0,
    target: "$50,000",
    earned: "$0",
    referrals: 0,
    active: 0,
    maxPotential: "$125"
  }
];

const referrals = [
  {
    id: "r1",
    name: "João Silva",
    avatar: "",
    level: 1,
    date: "2025-03-15",
    profit: "$120.50",
    bonus: "$6.02",
    status: "active",
    referrals: 3
  },
  {
    id: "r2",
    name: "Ana Paula",
    avatar: "",
    level: 1,
    date: "2025-04-02",
    profit: "$85.30",
    bonus: "$4.26",
    status: "active",
    referrals: 2
  },
  {
    id: "r3",
    name: "Ricardo Gomes",
    avatar: "",
    level: 1,
    date: "2025-04-18",
    profit: "$210.75",
    bonus: "$10.54",
    status: "active",
    referrals: 0
  },
  {
    id: "r4",
    name: "Luciana Costa",
    avatar: "",
    level: 2,
    date: "2025-03-22",
    profit: "$56.40",
    bonus: "$1.69",
    status: "active",
    referrals: 1
  },
];

function BonusLevel({ level, bonusRate, progress, target, earned, referrals, active, maxPotential }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-crypto-blue to-crypto-purple flex items-center justify-center text-white font-medium">
            {level}
          </div>
          <div>
            <div className="font-medium">Nível {level}</div>
            <div className="text-xs text-muted-foreground">Taxa de bônus: {bonusRate}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium text-crypto-green">{earned}</div>
          <div className="text-xs text-muted-foreground">Meta: {target}</div>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground pt-1">
        <div>Referidos: {referrals} (ativos: {active})</div>
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
          Ganhe bônus quando seus referidos lucram com copy trading e construa uma rede de referidos em até 5 níveis.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total ganho em bônus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-crypto-green">$167.50</div>
              <div className="text-sm text-muted-foreground mt-1">Desde o início</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Referidos diretos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <div className="text-sm text-muted-foreground mt-1">Ativos: 5</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total de referidos na rede</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm text-muted-foreground mt-1">Em todos os níveis</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Seus Níveis e Bônus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {bonusLevels.map((level) => (
              <BonusLevel key={level.level} {...level} />
            ))}
            
            <div className="text-sm text-muted-foreground pt-4">
              Convide mais traders para aumentar seus bônus em até 5 níveis e ganhe uma porcentagem de seus lucros!
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
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Data</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Lucros</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Seu Bônus</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Referidos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {referrals.filter(ref => ref.level === 1).map((referral) => (
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
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Nível</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Data</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Lucros</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Seu Bônus</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Status</th>
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
                          <td className="px-4 py-3 text-sm">{referral.level}</td>
                          <td className="px-4 py-3 text-sm">{referral.date}</td>
                          <td className="px-4 py-3 text-sm text-crypto-green">{referral.profit}</td>
                          <td className="px-4 py-3 text-sm text-crypto-green">{referral.bonus}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-crypto-green"></span>
                              Ativo
                            </div>
                          </td>
                        </tr>
                      ))}
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
