
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Link as LinkIcon, WifiHigh } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LevelProps {
  level: number;
  rank: string;
  bonusRate: string;
  progress: number;
  target: string;
  earned: string;
  requiredReferrals?: string;
}

const levels: LevelProps[] = [
  {
    level: 1,
    rank: "V1",
    bonusRate: "4%",
    progress: 100,
    target: "Cadastro",
    earned: "$40",
    requiredReferrals: "Nenhum"
  },
  {
    level: 2,
    rank: "V2",
    bonusRate: "5%",
    progress: 65,
    target: "$1.000",
    earned: "$50",
    requiredReferrals: "Nenhum"
  },
  {
    level: 3,
    rank: "V3",
    bonusRate: "6%",
    progress: 20,
    target: "$3.000",
    earned: "$18",
    requiredReferrals: "2 indicados V2"
  }
];

function BonusLevel({ level, rank, bonusRate, progress, target, earned, requiredReferrals }: LevelProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3772FF] to-[#8E33FF] flex items-center justify-center text-white font-medium">
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
      <Progress value={progress} className="h-2 bg-muted" indicatorClassName="bg-gradient-to-r from-[#3772FF] to-[#8E33FF]" />
      {requiredReferrals && (
        <div className="text-xs text-muted-foreground pt-1">
          Requisito: {requiredReferrals}
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
              </TabsList>
              
              <TabsContent value="levels">
                <div className="space-y-4">
                  {levels.map((level) => (
                    <BonusLevel key={level.level} {...level} />
                  ))}
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
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Network;
