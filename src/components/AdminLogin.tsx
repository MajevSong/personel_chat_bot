import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Eksik Bilgi",
        description: "Kullanıcı adı ve şifre gereklidir.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Admins tablosundan kullanıcıyı kontrol et
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("username", username.trim())
        .single();

      if (error || !data) {
        toast({
          title: "Giriş Başarısız",
          description: "Kullanıcı adı veya şifre hatalı.",
          variant: "destructive",
        });
        return;
      }

      // Şifre kontrolü (basit string karşılaştırması)
      if (data.password.toString() !== password) {
        toast({
          title: "Giriş Başarısız",
          description: "Kullanıcı adı veya şifre hatalı.",
          variant: "destructive",
        });
        return;
      }

      // Başarılı giriş
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminUsername", data.username);
      
      toast({
        title: "Giriş Başarılı",
        description: `Hoş geldiniz, ${data.username}!`,
      });

      onLoginSuccess();
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Hata",
        description: "Giriş yapılırken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-primary/5 p-4">
      <Card className="w-full max-w-md glass-card border-white/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Admin Girişi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin kullanıcı adınızı girin"
                className="bg-muted/50 border-white/20"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                className="bg-muted/50 border-white/20"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              variant="glow"
              className="w-full flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                "Giriş yapılıyor..."
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Giriş Yap
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};