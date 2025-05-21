
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { followTrader } from "@/lib/database";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const TraderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [trader, setTrader] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [allocationPercent, setAllocationPercent] = useState(10);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Carregar dados do trader
  useEffect(() => {
    async function loadTrader() {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('traders')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setTrader(data);
        
        // Verificar se o usuário tem API key configurada
        if (user) {
          const { data: apiKeys } = await supabase
            .from('api_keys')
            .select('id')
            .eq('user_id', user.id)
            .eq('exchange', 'bybit_follower');
            
          setHasApiKey(apiKeys && apiKeys.length > 0);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do trader:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar dados do trader.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadTrader();
  }, [id, user, toast]);

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar logado para seguir um trader.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    if (!hasApiKey) {
      toast({
        title: "API Key necessária",
        description: "Você precisa configurar sua API key da Bybit nas configurações antes de seguir um trader.",
        variant: "destructive"
      });
      navigate("/settings");
      return;
    }
    
    setFollowLoading(true);
    
    try {
      await followTrader(user.id, id!, allocationPercent);
      
      toast({
        title: "Trader seguido com sucesso",
        description: `Você está agora seguindo ${trader.name} com ${allocationPercent}% do seu capital.`
      });
      
      setDialogOpen(false);
      
      // Redirecionar para a página de copy trading
      navigate("/copy-trading");
    } catch (error) {
      console.error("Erro ao seguir trader:", error);
      toast({
        title: "Erro",
        description: "Não foi possível seguir este trader.",
        variant: "destructive"
      });
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p>Carregando perfil do trader...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!trader) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-xl font-bold">Trader não encontrado</h1>
          <p className="mt-2 text-muted-foreground">O trader que você procura não existe ou foi removido.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/traders")}
            className="mt-4"
          >
            Voltar para lista de traders
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{trader.name}</h1>
            <p className="text-muted-foreground">
              {trader.specialization} • Win rate: {trader.win_rate}
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full md:w-auto">
                Copiar este trader
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurar Copy Trading</DialogTitle>
                <DialogDescription>
                  Defina quanto do seu capital será alocado para copiar as operações deste trader.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Alocação de capital</Label>
                    <span className="font-medium">{allocationPercent}%</span>
                  </div>
                  <Slider
                    value={[allocationPercent]}
                    onValueChange={(values) => setAllocationPercent(values[0])}
                    min={5}
                    max={100}
                    step={5}
                  />
                  <p className="text-sm text-muted-foreground">
                    {allocationPercent}% do seu capital disponível será usado para copiar as operações deste trader.
                  </p>
                </div>
                
                {!hasApiKey && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md text-sm">
                    <strong>Atenção:</strong> Você precisa configurar sua API key da Bybit nas configurações antes de seguir este trader.
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleFollow} 
                  disabled={followLoading || !hasApiKey}
                >
                  {followLoading ? "Processando..." : "Confirmar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trader.win_rate}</div>
              <p className="text-xs text-muted-foreground">
                Últimos 30 dias
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Lucro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${trader.positive ? 'text-crypto-green' : 'text-crypto-red'}`}>
                {trader.profit_30d}
              </div>
              <p className="text-xs text-muted-foreground">
                Últimos 30 dias
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Seguidores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trader.followers}</div>
              <p className="text-xs text-muted-foreground">
                Usuários copiando
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="about">
          <TabsList>
            <TabsTrigger value="about">Sobre</TabsTrigger>
            <TabsTrigger value="performance">Desempenho</TabsTrigger>
            <TabsTrigger value="strategy">Estratégia</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Trader</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={trader.avatar_url || ''} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xl">
                      {trader.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <h3 className="font-medium text-lg flex items-center gap-2">
                          {trader.name}
                          {trader.verified && (
                            <Badge variant="outline" className="border-crypto-blue text-crypto-blue">
                              Verificado
                            </Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{trader.specialization}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-crypto-green text-crypto-green">
                          {trader.followers} seguidores
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm text-foreground whitespace-pre-line">
                      {trader.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Desempenho</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Dados detalhados de desempenho estão sendo carregados.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="strategy">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Estratégia</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Informações sobre a estratégia serão atualizadas em breve.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TraderProfile;
