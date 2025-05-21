
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { FileText, Upload, Key, TrendingUp } from "lucide-react";

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
  winRate: z.string().regex(/^\d+%$/, {
    message: "Win Rate deve estar no formato 'XX%'.",
  }).optional().or(z.literal("")),
  profit30d: z.string().regex(/^[+-]\d+(\.\d+)?%$/, {
    message: "Lucro 30d deve estar no formato '+XX.X%' ou '-XX.X%'.",
  }).optional().or(z.literal("")),
  profit90d: z.string().regex(/^[+-]\d+(\.\d+)?%$/, {
    message: "Lucro 90d deve estar no formato '+XX.X%' ou '-XX.X%'.",
  }).optional().or(z.literal("")),
  photo: z.instanceof(File).optional(),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MasterTraderFormProps {
  onSubmit?: (data: FormValues) => void;
}

const MasterTraderForm = ({ onSubmit }: MasterTraderFormProps) => {
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      strategyName: "",
      apiKey: "",
      apiSecret: "",
      bio: "",
      winRate: "65%",
      profit30d: "+15.0%",
      profit90d: "+45.0%",
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

  const handleSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    
    if (onSubmit) {
      onSubmit(data);
    } else {
      toast.success("Cadastro enviado com sucesso!");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                />
              </FormControl>
              <FormDescription>
                O nome que os seguidores verão para sua estratégia.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="winRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Win Rate</FormLabel>
                <FormControl>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="65%" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>Ex: 65%</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profit30d"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lucro Últimos 30 dias</FormLabel>
                <FormControl>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="+15.0%" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>Ex: +15.0% ou -5.0%</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profit90d"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lucro Últimos 90 dias</FormLabel>
                <FormControl>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="+45.0%" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormDescription>Ex: +45.0% ou -10.0%</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                    />
                  </div>
                </FormControl>
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
                    />
                  </div>
                </FormControl>
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Cadastrar como Master Trader
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MasterTraderForm;
