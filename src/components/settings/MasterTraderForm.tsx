
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { FileText, Upload, Key } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { generateTraderId } from "@/lib/traderStore";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  strategyName: z.string().min(3, {
    message: "Nome da estratégia deve ter pelo menos 3 caracteres.",
  }),
  apiKey: z.string().min(5, {
    message: "API Key é obrigatória.",
  }),
  apiSecret: z.string().min(5, {
    message: "API Secret é obrigatória.",
  }),
  bio: z.string().min(10, {
    message: "A bio deve ter pelo menos 10 caracteres.",
  }),
  photo: z.instanceof(File).optional(),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MasterTraderFormProps {
  onSubmit?: (data: FormValues) => void;
}

const MasterTraderForm = ({ onSubmit: externalOnSubmit }: MasterTraderFormProps) => {
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      strategyName: "",
      apiKey: "",
      apiSecret: "",
      bio: "",
      additionalInfo: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("photo", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para cadastrar-se como Master Trader");
      return;
    }
    
    try {
      setLoading(true);
      
      // Se houver um manipulador externo, use-o
      if (externalOnSubmit) {
        externalOnSubmit(data);
        return;
      }
      
      // Gerar ID único para o trader
      const traderId = generateTraderId();
      
      // Upload da foto se existir
      let avatarUrl = null;
      if (data.photo) {
        const fileExt = data.photo.name.split('.').pop();
        const fileName = `${traderId}.${fileExt}`;
        const filePath = `trader-avatars/${fileName}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(filePath, data.photo);
          
        if (uploadError) throw uploadError;
        
        // Obter URL pública da imagem
        const { data: { publicUrl } } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        avatarUrl = publicUrl;
      }
      
      // Inserir dados do trader no banco
      const { error } = await supabase
        .from('traders')
        .insert({
          id: traderId,
          name: data.name,
          avatar_url: avatarUrl,
          win_rate: "0%",
          followers: "0",
          profit_30d: "+0%",
          profit_90d: "+0%",
          positive: true,
          verified: false,
          specialization: data.strategyName,
          description: data.bio,
          user_id: user.id,
          api_key: data.apiKey,
          api_secret: data.apiSecret,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Exibir mensagem de sucesso e redirecionar
      toast.success("Cadastro como Master Trader realizado com sucesso!");
      navigate('/traders');
      
    } catch (error: any) {
      console.error("Erro ao cadastrar master trader:", error);
      toast.error(error.message || "Erro ao processar cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertTitle>Informação sobre métricas de desempenho</AlertTitle>
          <AlertDescription>
            Seu win rate e lucros dos últimos 30 e 90 dias serão calculados automaticamente com base nas operações realizadas na sua conta Bybit.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Seu nome completo" 
                  {...field} 
                  className="max-w-md"
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Este será o nome exibido no seu perfil público.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="strategyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Estratégia</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Scalping BTC/ETH" 
                  {...field} 
                  className="max-w-md"
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                O nome que os seguidores verão para sua estratégia.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bybit API Key</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Sua chave de API da Bybit" 
                      className="pl-10" 
                      {...field} 
                      disabled={loading}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Necessária para acessar suas operações e calcular métricas de desempenho.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bybit API Secret</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Seu segredo de API da Bybit" 
                      className="pl-10" 
                      type="password" 
                      {...field} 
                      disabled={loading}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Necessária para autenticar suas operações.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea 
                    placeholder="Descreva sua experiência, estratégia e resultados anteriores..." 
                    className="min-h-[120px] pl-10 pt-8" 
                    {...field} 
                    disabled={loading}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Essa descrição será exibida no seu perfil público de master trader.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Foto de Perfil</FormLabel>
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 rounded-md border flex items-center justify-center overflow-hidden bg-muted">
              {photoPreview ? (
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <Upload className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                id="photo"
                onChange={handlePhotoChange}
                className="max-w-md"
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Formatos suportados: JPG, PNG. Máximo 2MB.
              </p>
            </div>
          </div>
        </FormItem>

        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informações Adicionais (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Informações adicionais sobre sua estratégia, horários de operação, etc..." 
                  className="min-h-[100px]" 
                  {...field} 
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Processando..." : "Cadastrar como Master Trader"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MasterTraderForm;
