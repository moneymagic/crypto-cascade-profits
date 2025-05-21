
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { VastCopyLogo } from "../logo/VastCopyLogo";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { getTotalEarnings } from "@/lib/database";

export function WelcomeCard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    connectedTraders: 0,
    totalVolume: 0,
    totalBonus: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      try {
        setLoading(true);
        
        // Buscar quantidade de traders conectados
        const { data: followedTraders, error: followedError } = await supabase
          .from('followed_traders')
          .select('count')
          .eq('user_id', user.id)
          .eq('active', true)
          .single();
          
        if (followedError && followedError.code !== 'PGRST116') {
          console.error("Erro ao buscar traders:", followedError);
        }
        
        // Buscar volume total de transações
        const { data: trades, error: tradesError } = await supabase
          .from('trades')
          .select('amount')
          .eq('user_id', user.id);
          
        if (tradesError) {
          console.error("Erro ao buscar transações:", tradesError);
        }
        
        // Calcular volume total
        const totalVolume = trades ? trades.reduce((sum, trade) => sum + parseFloat(trade.amount), 0) : 0;
        
        // Buscar total de bônus
        const earnings = await getTotalEarnings(user.id);
        
        setStats({
          connectedTraders: followedTraders?.count || 0,
          totalVolume: totalVolume,
          totalBonus: earnings.referral
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, [user]);

  // Formatação dos números
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-vastcopy-navy to-vastcopy-blue/90 border-0 overflow-hidden shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <VastCopyLogo className="text-white" size="large" textColor="text-white" />
          </div>
          <p className="text-white/90 mt-2">
            Comece a copiar os melhores traders e ganhe bônus em vários níveis com nossa plataforma de Copy Trading.
          </p>
          <div className="bg-white/10 p-3 rounded-md backdrop-blur-sm border border-white/5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-white/70">Traders conectados</div>
                <div className="text-xl font-bold text-white">
                  {loading ? "..." : stats.connectedTraders}
                </div>
              </div>
              <div>
                <div className="text-sm text-white/70">Total volume</div>
                <div className="text-xl font-bold text-white">
                  {loading ? "..." : formatCurrency(stats.totalVolume)}
                </div>
              </div>
              <div>
                <div className="text-sm text-white/70">Bônus ganhos</div>
                <div className="text-xl font-bold text-white">
                  {loading ? "..." : formatCurrency(stats.totalBonus)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
