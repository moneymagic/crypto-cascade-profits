
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", btc: 4000, eth: 2400, total: 6400 },
  { name: "Fev", btc: 3000, eth: 1398, total: 4398 },
  { name: "Mar", btc: 2000, eth: 9800, total: 11800 },
  { name: "Abr", btc: 2780, eth: 3908, total: 6688 },
  { name: "Mai", btc: 1890, eth: 4800, total: 6690 },
  { name: "Jun", btc: 2390, eth: 3800, total: 6190 },
  { name: "Jul", btc: 3490, eth: 4300, total: 7790 },
];

export function TradingOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão geral de trading</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  borderColor: "#374151",
                  color: "#f9fafb" 
                }} 
              />
              <Line
                type="monotone"
                dataKey="btc"
                stroke="#3772FF"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="eth"
                stroke="#8E33FF"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
