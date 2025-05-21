
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

export function BonusNetwork() {
  return (
    <Card className="border shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
        <CardTitle>Rede de Bônus Multinível</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
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

        <div className="space-y-4">
          {levels.map((level) => (
            <BonusLevel key={level.level} {...level} />
          ))}
        </div>

        <div className="text-sm text-muted-foreground">
          Ganhe até 11% de comissão da rede com o sistema multinível baseado em performance e volume de lucro.
        </div>
      </CardContent>
    </Card>
  );
}
