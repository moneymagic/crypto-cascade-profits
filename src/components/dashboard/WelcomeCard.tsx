
import { Card, CardContent } from "@/components/ui/card";
import { VastCopyLogo } from "../logo/VastCopyLogo";

export function WelcomeCard() {
  return (
    <Card className="bg-gradient-to-br from-vastcopy-navy to-vastcopy-blue border-0 overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <VastCopyLogo className="text-white" size="large" />
          </div>
          <p className="text-white/90 mt-2">
            Comece a copiar os melhores traders e ganhe bônus em vários níveis com nossa plataforma de Copy Trading.
          </p>
          <div className="bg-white/10 p-3 rounded-md backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-white/70">Traders conectados</div>
                <div className="text-xl font-bold text-white">243</div>
              </div>
              <div>
                <div className="text-sm text-white/70">Total volume</div>
                <div className="text-xl font-bold text-white">$24.5M</div>
              </div>
              <div>
                <div className="text-sm text-white/70">Bônus ganhos</div>
                <div className="text-xl font-bold text-white">$1.2M</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
