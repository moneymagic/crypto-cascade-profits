
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LevelProps {
  level: number;
  bonusRate: string;
  progress: number;
  target: string;
  earned: string;
}

const levels: LevelProps[] = [
  {
    level: 1,
    bonusRate: "5%",
    progress: 100,
    target: "$1,000",
    earned: "$50"
  },
  {
    level: 2,
    bonusRate: "3%",
    progress: 65,
    target: "$5,000",
    earned: "$97.50"
  },
  {
    level: 3,
    bonusRate: "1%",
    progress: 20,
    target: "$10,000",
    earned: "$20"
  }
];

function BonusLevel({ level, bonusRate, progress, target, earned }: LevelProps) {
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
    </div>
  );
}

export function BonusNetwork() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rede de Bônus Multinível</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-secondary/50 p-4 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Total ganho em bônus</div>
            <div className="text-2xl font-bold text-crypto-green">$167.50</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Referidos ativos</div>
            <div className="text-2xl font-bold">12</div>
          </div>
        </div>

        <div className="space-y-4">
          {levels.map((level) => (
            <BonusLevel key={level.level} {...level} />
          ))}
        </div>

        <div className="text-sm text-muted-foreground">
          Convide mais traders para aumentar seus bônus em até 5 níveis e ganhe uma porcentagem de seus lucros!
        </div>
      </CardContent>
    </Card>
  );
}
