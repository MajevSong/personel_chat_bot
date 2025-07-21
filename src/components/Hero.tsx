import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, MessageSquare, Sparkles, Zap, Shield, Users } from "lucide-react";

interface HeroProps {
  onStartChat: () => void;
  onViewGuestbook: () => void;
}

export const Hero = ({ onStartChat, onViewGuestbook }: HeroProps) => {
  const features = [
    {
      icon: Zap,
      title: "Hızlı Yanıtlar",
      description: "AI asistanımız sorularınızı anında yanıtlar",
    },
    {
      icon: Shield,
      title: "Güvenli",
      description: "Verileriniz tamamen güvende",
    },
    {
      icon: Users,
      title: "Kolay Kullanım",
      description: "Sezgisel arayüz ile hemen başlayın",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Main Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <Sparkles className="w-8 h-8 text-primary animate-pulse" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-6">
          AI Asistanınız
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
          Gelişmiş yapay zeka teknolojisi ile sorularınızı yanıtlıyor, 
          size yardımcı oluyor ve ihtiyaçlarınızı karşılıyoruz.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onStartChat}
            variant="glow"
            size="lg"
            className="text-lg px-8 py-6 h-auto"
          >
            <Bot className="w-5 h-5 mr-2" />
            Sohbete Başla
          </Button>
          
          <Button
            onClick={onViewGuestbook}
            variant="glass"
            size="lg"
            className="text-lg px-8 py-6 h-auto"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Guestbook
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="glass-card border-white/20 p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Stats Section */}
      <Card className="glass-card border-white/20 p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
              7/24
            </div>
            <p className="text-sm text-muted-foreground">Kesintisiz Hizmet</p>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
              &lt;1s
            </div>
            <p className="text-sm text-muted-foreground">Yanıt Süresi</p>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
              AI
            </div>
            <p className="text-sm text-muted-foreground">Güçlü Teknoloji</p>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
              ∞
            </div>
            <p className="text-sm text-muted-foreground">Sınırsız Soru</p>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <div className="text-center mt-16 space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Hemen başlamaya hazır mısınız?
        </h2>
        <p className="text-muted-foreground mb-6">
          AI asistanımız ile tanışın ve sorularınızı sorun.
        </p>
        <Button
          onClick={onStartChat}
          variant="glow"
          size="lg"
          className="text-lg px-12 py-6 h-auto pulse-new"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Şimdi Başla
        </Button>
      </div>
    </div>
  );
};