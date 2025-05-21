
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Award, TrendingUp, Users, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTraderStore } from "@/lib/traderStore";

// Mock data for past operations
const pastOperations = [
  { id: 1, date: "2023-05-15", pair: "BTC/USDT", type: "Buy", amount: "0.05 BTC", price: "$42,850", result: "+12.3%", status: "Fechada" },
  { id: 2, date: "2023-05-12", pair: "ETH/USDT", type: "Buy", amount: "1.2 ETH", price: "$3,150", result: "+8.7%", status: "Fechada" },
  { id: 3, date: "2023-05-10", pair: "SOL/USDT", type: "Sell", amount: "15 SOL", price: "$128", result: "+5.2%", status: "Fechada" },
  { id: 4, date: "2023-05-07", pair: "AVAX/USDT", type: "Buy", amount: "10 AVAX", price: "$35.40", result: "-2.8%", status: "Fechada" },
  { id: 5, date: "2023-05-05", pair: "DOT/USDT", type: "Sell", amount: "25 DOT", price: "$18.75", result: "+9.3%", status: "Fechada" },
  { id: 6, date: "2023-05-01", pair: "BTC/USDT", type: "Sell", amount: "0.08 BTC", price: "$40,120", result: "+3.6%", status: "Fechada" },
];

// Mock data for top followers - updated to show dollar amounts instead of percentages
const topFollowers = [
  { id: 1, name: "Rafael Soares", profit: "$6,420", since: "Jan 2023", avatar: "" },
  { id: 2, name: "Julia Campos", profit: "$5,870", since: "Fev 2023", avatar: "" },
  { id: 3, name: "Pedro Marques", profit: "$5,230", since: "Dez 2022", avatar: "" },
  { id: 4, name: "Bianca Lopes", profit: "$4,980", since: "Mar 2023", avatar: "" },
  { id: 5, name: "Gabriel Santos", profit: "$4,510", since: "Fev 2023", avatar: "" },
];

// Form schema for copy trading investment
const formSchema = z.object({
  investmentAmount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine(
      (val) => {
        const num = parseFloat(val.replace(/[^0-9,.]/g, '').replace(',', '.'));
        return !isNaN(num) && num >= 10;
      },
      {
        message: "O valor mínimo de investimento é $10",
      }
    ),
  stopLoss: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const num = parseFloat(val.replace(/[^0-9,.]/g, '').replace(',', '.'));
        return isNaN(num) || num >= 5;
      },
      {
        message: "O Stop Loss deve ser no mínimo 5%",
      }
    ),
});

const TraderProfile = () => {
  const { traderId } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get all traders from the trader store
  const allTraders = useTraderStore((state) => state.traders);
  
  // Find trader data based on URL parameter
  const trader = allTraders.find(t => t.id === traderId);
  
  // Form for copy trading investment
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentAmount: "",
      stopLoss: "",
    },
  });
  
  if (!trader) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h1 className="text-2xl font-bold mb-4">Trader não encontrado</h1>
          <p className="text-muted-foreground mb-6">O perfil que você está procurando não existe ou foi removido.</p>
          <Link to="/traders">
            <Button>Voltar para lista de Traders</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }
  
  // Extended trader data for the profile view
  const extendedTrader = {
    ...trader,
    bio: trader.description || "Sem biografia disponível",
    profit180d: trader.profit90d ? `${parseFloat(trader.profit90d) * 2}%` : "+0%",
    rank: 1,
    totalTrades: 852,
    successfulTrades: 665,
    averageProfit: "3.8%",
  };
  
  const toggleFollow = () => {
    setDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Format the investment amount for display
    const amount = parseFloat(data.investmentAmount.replace(/[^0-9,.]/g, '').replace(',', '.'));
    
    // Close dialog
    setDialogOpen(false);
    
    // Set following state
    setIsFollowing(true);
    
    // Show success toast
    toast({
      title: "Copy Trading Ativado",
      description: `Você agora está copiando ${trader.name} com $${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    });
  };

  const formatCurrency = (input: string) => {
    // Remove non-numeric characters
    const numericValue = input.replace(/[^0-9]/g, '');
    
    // Convert to number and format
    if (numericValue) {
      const number = parseInt(numericValue, 10) / 100;
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD',
      }).format(number);
    }
    
    return input;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const formatted = formatCurrency(e.target.value);
    field.onChange(formatted);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Link to="/traders" className="text-sm text-muted-foreground hover:text-primary">
            &larr; Voltar para lista de Traders
          </Link>
        </div>
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-crypto-blue to-crypto-purple" />
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={trader.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                    {trader.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-2xl font-bold">{trader.name}</h2>
                    {trader.verified && (
                      <Badge variant="outline" className="border-crypto-blue text-crypto-blue">
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground">{trader.specialization}</div>
                </div>
                
                <div className="flex justify-center gap-2">
                  <Button 
                    onClick={toggleFollow}
                    variant={isFollowing ? "outline" : "default"}
                  >
                    {isFollowing ? "Deixar de copiar" : "Copiar Trader"}
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 w-full gap-4 py-4 border-y mt-2">
                  <div>
                    <div className="font-medium text-2xl">{trader.winRate}</div>
                    <div className="text-xs text-muted-foreground">Win Rate</div>
                  </div>
                  <div>
                    <div className={`font-medium text-2xl ${trader.positive ? 'text-crypto-green' : 'text-crypto-red'}`}>
                      {trader.profit30d}
                    </div>
                    <div className="text-xs text-muted-foreground">30 dias</div>
                  </div>
                  <div>
                    <div className="font-medium text-2xl">{typeof trader.followers === 'number' ? trader.followers.toLocaleString() : trader.followers}</div>
                    <div className="text-xs text-muted-foreground">Seguidores</div>
                  </div>
                </div>
                
                <div className="w-full text-left">
                  <h3 className="font-semibold mb-1">Bio</h3>
                  <p className="text-sm text-muted-foreground">{extendedTrader.bio}</p>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground text-sm w-full justify-start">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span>Ranking #{extendedTrader.rank} entre traders</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Desempenho</CardTitle>
              <CardDescription>Histórico de desempenho ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="lucratividade">
                <TabsList className="mb-4">
                  <TabsTrigger value="lucratividade">Lucratividade</TabsTrigger>
                  <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="lucratividade">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <TrendingUp className="h-8 w-8 mx-auto text-crypto-green mb-2" />
                            <div className="text-2xl font-semibold text-crypto-green">{trader.profit30d}</div>
                            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <TrendingUp className="h-8 w-8 mx-auto text-crypto-green mb-2" />
                            <div className="text-2xl font-semibold text-crypto-green">{trader.profit90d}</div>
                            <p className="text-xs text-muted-foreground">Últimos 90 dias</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <TrendingUp className="h-8 w-8 mx-auto text-crypto-green mb-2" />
                            <div className="text-2xl font-semibold text-crypto-green">{extendedTrader.profit180d}</div>
                            <p className="text-xs text-muted-foreground">Últimos 180 dias</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                          <div className="text-center text-muted-foreground">
                            <p>Gráfico de desempenho</p>
                            <p className="text-xs">(Dados simulados para demonstração)</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="estatisticas">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Activity className="h-8 w-8 mx-auto text-primary mb-2" />
                          <div className="text-2xl font-semibold">{extendedTrader.totalTrades}</div>
                          <p className="text-xs text-muted-foreground">Total de Operações</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Activity className="h-8 w-8 mx-auto text-crypto-green mb-2" />
                          <div className="text-2xl font-semibold">{extendedTrader.successfulTrades}</div>
                          <p className="text-xs text-muted-foreground">Operações Lucrativas</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <TrendingUp className="h-8 w-8 mx-auto text-crypto-green mb-2" />
                          <div className="text-2xl font-semibold text-crypto-green">{extendedTrader.averageProfit}</div>
                          <p className="text-xs text-muted-foreground">Lucro Médio/Operação</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Operations History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Operações Recentes
            </CardTitle>
            <CardDescription>Histórico das últimas operações realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Par</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastOperations.map((op) => (
                  <TableRow key={op.id}>
                    <TableCell>{op.date}</TableCell>
                    <TableCell>{op.pair}</TableCell>
                    <TableCell>
                      <Badge variant={op.type === "Buy" ? "default" : "destructive"}>
                        {op.type === "Buy" ? "Compra" : "Venda"}
                      </Badge>
                    </TableCell>
                    <TableCell>{op.amount}</TableCell>
                    <TableCell>{op.price}</TableCell>
                    <TableCell className={op.result.includes("+") ? "text-crypto-green" : "text-crypto-red"}>
                      {op.result}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-crypto-green text-crypto-green">
                        {op.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Top Followers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Seguidores
            </CardTitle>
            <CardDescription>Os seguidores que mais lucraram copiando este trader</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topFollowers.map((follower, index) => (
                <div key={follower.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary">
                      {index + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={follower.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {follower.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{follower.name}</div>
                      <div className="text-sm text-muted-foreground">Seguindo desde {follower.since}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-crypto-green">{follower.profit}</div>
                    <div className="text-sm text-muted-foreground">Lucro Total</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Copy Trading Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Copiar {trader.name}</DialogTitle>
            <DialogDescription>
              Defina o valor que você deseja investir para copiar as operações deste trader.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="investmentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Investimento</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="$0.00" 
                        value={field.value}
                        onChange={(e) => handleInputChange(e, field)}
                        className="text-lg"
                      />
                    </FormControl>
                    <FormDescription>
                      Valor mínimo: $10.00
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stopLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stop Loss (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="5%" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Defina uma % de perda máxima para encerrar automaticamente o copy trading
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Confirmar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TraderProfile;
