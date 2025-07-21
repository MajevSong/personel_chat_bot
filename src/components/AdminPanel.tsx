import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit, MessageSquare, Users, Database, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface KnowledgeItem {
  id: number;
  question: string;
  answer: string;
  tags: string;
  active: boolean;
  created_at: string;
}

interface ChatLog {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

interface GuestbookEntry {
  id: number;
  message: string;
  created_at: string;
}

export const AdminPanel = () => {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([]);
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);
  const [newKnowledge, setNewKnowledge] = useState({
    question: "",
    answer: "",
    tags: "",
    active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Bilgi tabanını getir
      const { data: knowledgeData } = await supabase
        .from("chatbot_knowledge")
        .select("*")
        .order("created_at", { ascending: false });

      // Chat loglarını getir
      const { data: logsData } = await supabase
        .from("chatbot_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      // Guestbook kayıtlarını getir
      const { data: guestbookData } = await supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false });

      setKnowledge(knowledgeData || []);
      setChatLogs(logsData || []);
      setGuestbook(guestbookData || []);
    } catch (error) {
      console.error("Fetch data error:", error);
      toast({
        title: "Hata",
        description: "Veriler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const addKnowledge = async () => {
    if (!newKnowledge.question.trim() || !newKnowledge.answer.trim()) {
      toast({
        title: "Eksik Bilgi",
        description: "Soru ve cevap alanları zorunludur.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("chatbot_knowledge").insert({
        question: newKnowledge.question.trim(),
        answer: newKnowledge.answer.trim(),
        tags: newKnowledge.tags.trim(),
        active: newKnowledge.active,
      });

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Yeni bilgi eklendi.",
      });

      setNewKnowledge({ question: "", answer: "", tags: "", active: true });
      setIsAddingKnowledge(false);
      fetchData();
    } catch (error) {
      console.error("Add knowledge error:", error);
      toast({
        title: "Hata",
        description: "Bilgi eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const toggleKnowledgeStatus = async (id: number, active: boolean) => {
    try {
      const { error } = await supabase
        .from("chatbot_knowledge")
        .update({ active: !active })
        .eq("id", id);

      if (error) throw error;

      fetchData();
      toast({
        title: "Başarılı",
        description: `Bilgi ${!active ? "aktif" : "pasif"} edildi.`,
      });
    } catch (error) {
      console.error("Toggle knowledge error:", error);
      toast({
        title: "Hata",
        description: "Durum güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const deleteGuestbookEntry = async (id: number) => {
    try {
      const { error } = await supabase
        .from("guestbook")
        .delete()
        .eq("id", id);

      if (error) throw error;

      fetchData();
      toast({
        title: "Başarılı",
        description: "Guestbook kaydı silindi.",
      });
    } catch (error) {
      console.error("Delete guestbook error:", error);
      toast({
        title: "Hata",
        description: "Kayıt silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Admin Paneli
        </h1>
        <p className="text-muted-foreground mt-2">Chatbot ve sistem yönetimi</p>
      </div>

      <Tabs defaultValue="knowledge" className="space-y-6">
        <TabsList className="glass-card border-white/20">
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Bilgi Tabanı
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat Logları
          </TabsTrigger>
          <TabsTrigger value="guestbook" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Guestbook
          </TabsTrigger>
        </TabsList>

        {/* Bilgi Tabanı */}
        <TabsContent value="knowledge">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Chatbot Bilgi Tabanı</h2>
              <Dialog open={isAddingKnowledge} onOpenChange={setIsAddingKnowledge}>
                <DialogTrigger asChild>
                  <Button variant="glow" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Yeni Bilgi Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-white/20">
                  <DialogHeader>
                    <DialogTitle>Yeni Bilgi Ekle</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="question">Soru</Label>
                      <Input
                        id="question"
                        value={newKnowledge.question}
                        onChange={(e) => setNewKnowledge({ ...newKnowledge, question: e.target.value })}
                        placeholder="Örnek soru yazın..."
                        className="bg-muted/50 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="answer">Cevap</Label>
                      <Textarea
                        id="answer"
                        value={newKnowledge.answer}
                        onChange={(e) => setNewKnowledge({ ...newKnowledge, answer: e.target.value })}
                        placeholder="Cevabı yazın..."
                        className="bg-muted/50 border-white/20 min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
                      <Input
                        id="tags"
                        value={newKnowledge.tags}
                        onChange={(e) => setNewKnowledge({ ...newKnowledge, tags: e.target.value })}
                        placeholder="etiket1, etiket2, etiket3"
                        className="bg-muted/50 border-white/20"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newKnowledge.active}
                        onCheckedChange={(checked) => setNewKnowledge({ ...newKnowledge, active: checked })}
                      />
                      <Label>Aktif</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addKnowledge} variant="glow" className="flex-1">
                        Ekle
                      </Button>
                      <Button
                        onClick={() => setIsAddingKnowledge(false)}
                        variant="ghost"
                        className="flex-1"
                      >
                        İptal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {knowledge.map((item) => (
                  <Card key={item.id} className="glass-card border-white/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-2">{item.question}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{item.answer}</p>
                          {item.tags && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {item.tags.split(",").map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString("tr-TR")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.active}
                            onCheckedChange={() => toggleKnowledgeStatus(item.id, item.active)}
                          />
                          <Badge variant={item.active ? "default" : "secondary"}>
                            {item.active ? "Aktif" : "Pasif"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Chat Logları */}
        <TabsContent value="logs">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Son Chat Logları</h2>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {chatLogs.map((log) => (
                  <Card key={log.id} className="glass-card border-white/20">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <Badge variant="outline" className="mb-2">Soru</Badge>
                          <p className="text-sm">{log.question}</p>
                        </div>
                        <div>
                          <Badge variant="default" className="mb-2">Cevap</Badge>
                          <p className="text-sm text-muted-foreground">{log.answer}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleString("tr-TR")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Guestbook */}
        <TabsContent value="guestbook">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Guestbook Kayıtları</h2>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {guestbook.map((entry) => (
                  <Card key={entry.id} className="glass-card border-white/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm mb-2">{entry.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.created_at).toLocaleString("tr-TR")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGuestbookEntry(entry.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};