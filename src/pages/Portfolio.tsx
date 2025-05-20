
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const portfolioData = [
  { name: "1 Mai", value: 10000 },
  { name: "5 Mai", value: 10420 },
  { name: "10 Mai", value: 10380 },
  { name: "15 Mai", value: 11200 },
  { name: "20 Mai", value: 11850 },
];

const assets = [
  {
    coin: "Bitcoin",
    symbol: "BTC",
    amount: 0.42,
    value: 5880,
    change24h: "+2.4%",
    color: "#F7931A",
    positive: true,
  },
  {
    coin: "Ethereum",
    symbol: "ETH",
    amount: 2.81,
    value: 3934,
    change24h: "+1.7%",
    color: "#627EEA",
    positive: true,
  },
  {
    coin: "Cardano",
    symbol: "ADA",
    amount: 1205.42,
    value: 1084,
    change24h: "-0.8%",
    color: "#0033AD",
    positive: false,
  },
  {
    coin: "Solana",
    symbol: "SOL",
    amount: 5.23,
    value: 952,
    change24h: "+3.5%",
    color: "#00FFA3",
    positive: true,
  },
];

const pieData = assets.map((asset) => ({
  name: asset.symbol,
  value: asset.value,
  color: asset.color,
}));

const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

const Portfolio = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Meu Portfólio</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Desempenho da carteira</CardTitle>
                <Badge variant="outline" className="border-crypto-green text-crypto-green">
                  +18.5% (30d)
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#1f2937", 
                        borderColor: "#374151",
                        color: "#f9fafb" 
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Valor"]} 
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3772FF"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribuição</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Valor"]}
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                        color: "#f9fafb"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4">
                <div className="text-lg font-semibold">
                  Total: ${totalValue.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="space-y-4">
                  {assets.map((asset) => (
                    <div
                      key={asset.symbol}
                      className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="h-10 w-10 rounded-full"
                          style={{ backgroundColor: asset.color }}
                        />
                        <div>
                          <div className="font-medium">
                            {asset.coin} ({asset.symbol})
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {asset.amount.toLocaleString()} {asset.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${asset.value.toLocaleString()}
                        </div>
                        <div
                          className={`text-sm ${
                            asset.positive
                              ? "text-crypto-green"
                              : "text-crypto-red"
                          }`}
                        >
                          {asset.change24h}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="crypto">
                <div className="p-4 text-center text-muted-foreground">
                  Mesma lista filtrada para mostrar apenas criptomoedas
                </div>
              </TabsContent>
              <TabsContent value="tokens">
                <div className="p-4 text-center text-muted-foreground">
                  Mesma lista filtrada para mostrar apenas tokens
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Portfolio;
