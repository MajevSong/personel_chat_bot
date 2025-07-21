import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GuestbookEntry {
  id: number;
  message: string;
  created_at: string;
}

export const Guestbook = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Fetch entries error:", error);
      toast({
        title: "Hata",
        description: "Mesajlar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const addEntry = async () => {
    if (!newMessage.trim()) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen bir mesaj yazın.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("guestbook").insert({
        message: newMessage.trim(),
      });

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Mesajınız guestbook'a eklendi!",
      });

      setNewMessage("");
      fetchEntries();
    } catch (error) {
      console.error("Add entry error:", error);
      toast({
        title: "Hata",
        description: "Mesaj eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      addEntry();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Guestbook
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Düşüncelerinizi, geri bildirimlerinizi veya sadece merhaba demek istediğinizi buraya yazabilirsiniz. 
          Tüm mesajlar herkese açık olarak görüntülenir.
        </p>
      </div>

      {/* Mesaj yazma alanı */}
      <Card className="glass-card border-white/20 mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Yeni mesaj yazın
              </label>
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesajınızı buraya yazın... (Ctrl+Enter ile gönderebilirsiniz)"
                className="bg-muted/50 border-white/20 focus:border-primary transition-colors min-h-[120px] resize-none"
                disabled={isSubmitting}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">
                  {newMessage.length}/500 karakter • Ctrl+Enter ile gönderin
                </p>
              </div>
            </div>
            <Button
              onClick={addEntry}
              disabled={!newMessage.trim() || isSubmitting}
              variant="glow"
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Gönderiliyor..." : "Mesajı Gönder"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mesajlar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Heart className="w-4 h-4" />
          <span className="text-sm">
            {entries.length} mesaj paylaşıldı
          </span>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {entries.length === 0 ? (
              <Card className="glass-card border-white/20">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Henüz mesaj yok
                  </h3>
                  <p className="text-muted-foreground">
                    İlk mesajı yazan siz olun! Yukarıdaki alana bir şeyler yazın.
                  </p>
                </CardContent>
              </Card>
            ) : (
              entries.map((entry, index) => (
                <Card key={entry.id} className="glass-card border-white/20 message-fade-in">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {String(entries.length - index).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {entry.message}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <span>
                            {new Date(entry.created_at).toLocaleDateString("tr-TR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};