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
import { Award, TrendingUp, Users, Activity } from "lucide-react";

// Mock data for a trader
const traders = [
  {
    id: "1",
    name: "Carlos Almeida",
    avatar: "",
    winRate: "78%",
    followers: 1200,
    profit30d: "+32.5%",
    profit90d: "+87.3%",
    profit180d: "+145.2%",
    positive: true,
    verified: true,
    specialization: "BTC/ETH",
    bio: "Trader especializado em Bitcoin e Ethereum com mais de 5 anos de experiência. Minha estratégia combina análise técnica com fundamentos macroeconômicos para maximizar resultados em mercados voláteis.",
    rank: 1,
    totalTrades: 852,
    successfulTrades: 665,
    averageProfit: "3.8%",
  },
  {
    id: "2",
    name: "Daniela Santos",
    avatar: "",
    winRate: "67%",
    followers: 856,
    profit30d: "+18.3%",
    profit90d: "+52.8%",
    profit180d: "+98.6%",
    positive: true,
    verified: true,
    specialization: "Altcoins",
    bio: "Foco em altcoins com potencial de crescimento e análise fundamentalista. Utilizo indicadores on-chain e análise de sentimento para identificar oportunidades antes do mercado.",
    rank: 3,
    totalTrades: 721,
    successfulTrades: 483,
    averageProfit: "4.2%",
  },
  {
    id: "3",
    name: "Fernando Costa",
    avatar: "",
    winRate: "72%",
    followers: 943,
    profit30d: "+24.7%",
    profit90d: "+61.5%",
    profit180d: "+103.8%",
    positive: true,
    verified: false,
    specialization: "NFT Tokens",
    bio: "Especialista em tokens relacionados ao mercado de NFT e metaverso. Minha abordagem identifica projetos promissores antes de ganharem popularidade no mercado.",
    rank: 5,
    totalTrades: 632,
    successfulTrades: 455,
    averageProfit: "3.5%",
  },
  {
    id: "4",
    name: "Márcia Oliveira",
    avatar: "",
    winRate: "81%",
    followers: 2500,
    profit30d: "+41.2%",
    profit90d: "+105.7%",
    profit180d: "+186.3%",
    positive: true,
    verified: true,
    specialization: "DeFi",
    bio: "Estratégias em DeFi, yield farming e staking com resultados consistentes. Desenvolvi um sistema proprietário para avaliar e maximizar rendimentos em diferentes protocolos.",
    rank: 2,
    totalTrades: 964,
    successfulTrades: 781,
    averageProfit: "4.5%",
  },
  {
    id: "5",
    name: "Roberto Mendes",
    avatar: "",
    winRate: "64%",
    followers: 721,
    profit30d: "+15.8%",
    profit90d: "+37.2%",
    profit180d: "+72.6%",
    positive: true,
    verified: false,
    specialization: "Swing Trading",
    bio: "Trader de swing trading com base em análise técnica e indicadores. Minha estratégia foi desenvolvida após 7 anos de experiência em mercados tradicionais e criptomoedas.",
    rank: 7,
    totalTrades: 528,
    successfulTrades: 338,
    averageProfit: "3.1%",
  },
  {
    id: "6",
    name: "Ana Clara Silva",
    avatar: "",
    winRate: "75%",
    followers: 1100,
    profit30d: "+28.2%",
    profit90d: "+71.9%",
    profit180d: "+132.4%",
    positive: true,
    verified: true,
    specialization: "Scalping",
    bio: "Especialista em scalping com operações de curta duração e alto volume. Minha técnica permite capturar pequenas variações com consistência.",
    rank: 4,
    totalTrades: 1450,
    successfulTrades: 1087,
    averageProfit: "1.8%",
  }
];

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

const TraderProfile = () => {
  const { traderId } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Find trader data based on URL parameter
  const trader = traders.find(t => t.id === traderId);
  
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
  
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
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
                    <div className="font-medium text-2xl">{trader.followers.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Seguidores</div>
                  </div>
                </div>
                
                <div className="w-full text-left">
                  <h3 className="font-semibold mb-1">Bio</h3>
                  <p className="text-sm text-muted-foreground">{trader.bio}</p>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground text-sm w-full justify-start">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span>Ranking #{trader.rank} entre traders</span>
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
                            <div className="text-2xl font-semibold text-crypto-green">{trader.profit180d}</div>
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
                          <div className="text-2xl font-semibold">{trader.totalTrades}</div>
                          <p className="text-xs text-muted-foreground">Total de Operações</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Activity className="h-8 w-8 mx-auto text-crypto-green mb-2" />
                          <div className="text-2xl font-semibold">{trader.successfulTrades}</div>
                          <p className="text-xs text-muted-foreground">Operações Lucrativas</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <TrendingUp className="h-8 w-8 mx-auto text-crypto-green mb-2" />
                          <div className="text-2xl font-semibold text-crypto-green">{trader.averageProfit}</div>
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
    </DashboardLayout>
  );
};

export default TraderProfile;
