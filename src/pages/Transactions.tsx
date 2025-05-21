
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

// Schema para validação do formulário
const formSchema = z.object({
  amount: z.string()
    .refine(value => {
      const amount = Number(value.replace(/[^0-9.]/g, ''));
      return !isNaN(amount) && amount > 0;
    }, "Valor deve ser maior que zero")
});

type FormValues = z.infer<typeof formSchema>;

// Interfaces para tipagem dos dados
interface Transaction {
  id: string;
  amount: number;
  type: "deposit" | "withdrawal";
  status: "completed" | "pending" | "failed";
  created_at: string;
  description: string | null;
}

// Função para formatar valores monetários
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

// Função para formatar input de valor como moeda
const formatCurrencyInput = (value: string) => {
  const numericValue = value.replace(/[^0-9]/g, '');
  const numberValue = Number(numericValue) / 100;
  return formatCurrency(numberValue);
};

const Transactions = () => {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdrawal">("deposit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Formulário para depósito/saque
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  // Buscar histórico de transações
  const { data: transactions = [], refetch } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user?.id,
  });

  // Buscar saldo atual
  const { data: balance = 0, refetch: refetchBalance } = useQuery({
    queryKey: ['balance', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data.balance;
    },
    enabled: !!user?.id,
  });

  // Handle para depósito/saque
  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Converter valor de string formatada para número
      const amountValue = Number(data.amount.replace(/[^0-9.]/g, ''));
      
      // Verificar se há saldo suficiente para saque
      if (activeTab === "withdrawal" && amountValue > balance) {
        toast.error("Saldo insuficiente para realizar este saque");
        return;
      }
      
      // Criar transação
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: amountValue,
          type: activeTab,
          status: 'completed',
          description: activeTab === 'deposit' ? 'Depósito realizado' : 'Saque realizado',
          created_at: new Date().toISOString(),
        });
        
      if (transactionError) throw transactionError;
      
      // Atualizar saldo
      const newBalance = activeTab === 'deposit'
        ? balance + amountValue
        : balance - amountValue;
        
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', user.id);
        
      if (balanceError) throw balanceError;
      
      // Limpar formulário e mostrar mensagem de sucesso
      form.reset({ amount: "" });
      toast.success(activeTab === 'deposit' 
        ? "Depósito realizado com sucesso" 
        : "Saque realizado com sucesso"
      );
      
      // Atualizar dados
      refetch();
      refetchBalance();
      
    } catch (error) {
      console.error(`Erro ao processar ${activeTab}:`, error);
      toast.error(`Erro ao processar ${activeTab === 'deposit' ? 'depósito' : 'saque'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle para mudança no input de valor
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const formattedValue = formatCurrencyInput(e.target.value);
    field.onChange(formattedValue);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Depósito e Saque</h1>
          <p className="text-muted-foreground">
            Gerencie seu saldo para copy trading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Saldo Atual</CardTitle>
              <CardDescription>Seu saldo disponível para copy trading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Movimentar Saldo</CardTitle>
              <CardDescription>Realize depósitos ou saques</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "deposit" | "withdrawal")}>
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="deposit">Depósito</TabsTrigger>
                  <TabsTrigger value="withdrawal">Saque</TabsTrigger>
                </TabsList>
                
                <TabsContent value="deposit">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor do Depósito</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="$0.00"
                                value={field.value}
                                onChange={(e) => handleAmountChange(e, field)}
                                className="text-lg"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processando..." : "Realizar Depósito"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="withdrawal">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor do Saque</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="$0.00"
                                value={field.value}
                                onChange={(e) => handleAmountChange(e, field)}
                                className="text-lg"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processando..." : "Realizar Saque"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Transações */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>Suas transações recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={transaction.type === "deposit" ? "default" : "outline"}
                        >
                          {transaction.type === "deposit" ? "Depósito" : "Saque"}
                        </Badge>
                      </TableCell>
                      <TableCell className={
                        transaction.type === "deposit" 
                          ? "text-crypto-green" 
                          : "text-crypto-red"
                      }>
                        {transaction.type === "deposit" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            transaction.status === "completed"
                              ? "default" 
                              : transaction.status === "pending"
                              ? "outline" 
                              : "destructive"
                          }
                        >
                          {transaction.status === "completed" 
                            ? "Concluído" 
                            : transaction.status === "pending" 
                            ? "Pendente" 
                            : "Falhou"}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.description || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
