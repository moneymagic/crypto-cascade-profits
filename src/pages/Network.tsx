import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Link as LinkIcon, WifiHigh } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { MultiLevelBonus } from "@/components/network/MultiLevelBonus";
import { ReferralExplorer } from "@/components/network/ReferralExplorer";
import { useAuth } from "@/contexts/AuthContext";
import { generateReferralLink, getReferralStats, getTotalEarnings } from "@/lib/database";

const Network = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0 });
  const [totalEarned, setTotalEarned] = useState(0);
  const [userRank, setUserRank] = useState("V1");
  
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Gerar link de referência
        const link = await generateReferralLink(user.id);
        setReferralLink(link);
        
        // Carregar estatísticas
        const referralStats = await getReferralStats(user.id);
        setStats(referralStats);
        
        // Carregar ganhos totais
        const earnings = await getTotalEarnings(user.id);
        setTotalEarned(earnings.referral);
        
        // Para este exemplo, estamos definindo um rank fixo
        // Em uma implementação real, isso viria do banco de dados
        setUserRank("V2");
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível obter as informações de rede.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user]);
  
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
                    <div className="text-2xl font-bold">{stats.total}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Indicados ativos</div>
                    <div className="text-2xl font-bold">{stats.active}</div>
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
                  <div className="text-2xl font-bold text-crypto-green">${totalEarned.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Seu ranking atual</div>
                  <div className="text-2xl font-bold">{userRank}</div>
                </div>
              </div>
              
              <Button className="w-full">Sacar Ganhos</Button>
            </CardContent>
          </Card>
        </div>
        
        <MultiLevelBonus userId={user?.id} />
        
        <ReferralExplorer userId={user?.id} />
      </div>
    </DashboardLayout>
  );
};

export default Network;
