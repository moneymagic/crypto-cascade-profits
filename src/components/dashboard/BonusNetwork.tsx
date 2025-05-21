
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { getUserRanks } from "@/lib/database";
import { toast } from "@/components/ui/use-toast";

interface LevelProps {
  level: number;
  rank: string;
  bonusRate: string;
  progress: number;
  target: string;
  earned: string;
  requiredReferrals?: string;
}

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
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState<LevelProps[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [currentRank, setCurrentRank] = useState("V1");
  
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Carregar níveis do usuário
        const userRanks = await getUserRanks(user.id);
        
        if (userRanks.length > 0) {
          // Mapear dados para o formato esperado pelo componente
          const mappedLevels = userRanks.map(rank => ({
            level: rank.id.includes("V3") ? 3 : rank.id.includes("V2") ? 2 : 1,
            rank: rank.rank,
            bonusRate: rank.bonus_rate,
            progress: rank.progress,
            target: rank.target,
            earned: rank.earned,
            requiredReferrals: rank.required_referrals
          }));
          
          setLevels(mappedLevels);
          
          // Calcular total ganho
          const total = userRanks.reduce((sum, rank) => {
            const value = parseFloat(rank.earned.replace("$", ""));
            return sum + (isNaN(value) ? 0 : value);
          }, 0);
          
          setTotalEarned(total);
          
          // Definir rank atual
          const activeRank = userRanks.find(r => r.progress === 100);
          if (activeRank) {
            setCurrentRank(activeRank.rank);
          }
        } else {
          // Se não houver dados, usar os valores iniciais
          setLevels([
            {
              level: 1,
              rank: "V1",
              bonusRate: "4%",
              progress: 100,
              target: "Cadastro",
              earned: "$0",
              requiredReferrals: "Nenhum"
            },
            {
              level: 2,
              rank: "V2",
              bonusRate: "5%",
              progress: 0,
              target: "$1.000",
              earned: "$0",
              requiredReferrals: "Nenhum"
            },
            {
              level: 3,
              rank: "V3",
              bonusRate: "6%",
              progress: 0,
              target: "$3.000",
              earned: "$0",
              requiredReferrals: "2 indicados V2"
            }
          ]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível obter as informações de bônus.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user]);

  return (
    <Card className="border shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#1A1F2C] to-[#252a38] text-white rounded-t-lg">
        <CardTitle>Rede de Bônus Multinível</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {loading ? (
          <div className="text-center py-4">Carregando informações de bônus...</div>
        ) : (
          <>
            <div className="bg-secondary/20 p-4 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total ganho em bônus</div>
                <div className="text-2xl font-bold text-crypto-green">${totalEarned.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Seu ranking atual</div>
                <div className="text-2xl font-bold">{currentRank}</div>
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
