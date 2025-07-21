import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Merhaba! Ben AI asistanınızım. Size nasıl yardımcı olabilirim?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const findBestAnswer = async (question: string): Promise<string> => {
    try {
      // Chatbot bilgi tabanından en uygun cevabı bul
      const { data: knowledge, error } = await supabase
        .from("chatbot_knowledge")
        .select("*")
        .eq("active", true);

      if (error) throw error;

      if (!knowledge || knowledge.length === 0) {
        return "Üzgünüm, şu anda bu konuda size yardımcı olacak bilgim yok. Lütfen daha sonra tekrar deneyin.";
      }

      // Basit anahtar kelime eşleştirmesi
      const questionLower = question.toLowerCase();
      const bestMatch = knowledge.find(item => 
        item.question?.toLowerCase().includes(questionLower.substring(0, 5)) ||
        questionLower.includes(item.question?.toLowerCase().substring(0, 5) || "")
      );

      return bestMatch?.answer || "Bu konuda size yardımcı olacak bilgim yok, ancak sorunuzu not ettim.";
    } catch (error) {
      console.error("Chatbot knowledge error:", error);
      return "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Sohbet geçmişini kaydet
      await supabase.from("chatbot_logs").insert({
        question: userMessage.text,
        answer: "Processing...",
      });

      // Simulated delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const answer = await findBestAnswer(userMessage.text);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Cevabı güncelle
      await supabase.from("chatbot_logs").insert({
        question: userMessage.text,
        answer: answer,
      });

    } catch (error) {
      console.error("Send message error:", error);
      toast({
        title: "Hata",
        description: "Mesaj gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      {/* Header */}
      <div className="glass-card rounded-t-2xl p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI Asistan</h2>
            <p className="text-sm text-muted-foreground">Size yardımcı olmaktan mutluluk duyarım</p>
          </div>
          <div className="ml-auto">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 glass-card border-x border-white/10">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 message-fade-in ${
                message.isBot ? "justify-start" : "justify-end"
              }`}
            >
              {message.isBot && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <Card className={`max-w-[80%] p-3 ${
                message.isBot 
                  ? "glass-card border-white/20" 
                  : "bg-primary text-primary-foreground shadow-lg"
              }`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.isBot ? "text-muted-foreground" : "text-primary-foreground/70"
                }`}>
                  {message.timestamp.toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>

              {!message.isBot && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start message-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <Card className="glass-card border-white/20 p-3">
                <div className="flex items-center gap-1">
                  <div className="typing-dots text-muted-foreground">Yazıyor</div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="glass-card rounded-b-2xl p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Bir mesaj yazın..."
            className="flex-1 bg-muted/50 border-white/20 focus:border-primary transition-colors"
            disabled={isTyping}
          />
          <Button
            onClick={sendMessage}
            disabled={!inputText.trim() || isTyping}
            variant="glow"
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};