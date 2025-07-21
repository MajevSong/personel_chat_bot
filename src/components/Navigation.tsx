import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, MessageSquare, Settings, Home, Menu, X } from "lucide-react";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Ana Sayfa", icon: Home },
    { id: "chat", label: "Chatbot", icon: Bot },
    { id: "guestbook", label: "Guestbook", icon: MessageSquare },
    { id: "admin", label: "Admin", icon: Settings },
  ];

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="glass"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Card className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 p-4 glass-card border-r border-white/20 
        transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Logo/Header */}
          <div className="text-center pt-4 pb-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center mx-auto mb-3">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              AI Platform
            </h1>
            <p className="text-sm text-muted-foreground">Akıllı Asistan</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "glow" : "ghost"}
                  className={`
                    w-full justify-start gap-3 h-12 text-left
                    ${isActive ? "shadow-lg" : "hover:bg-white/10"}
                  `}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-muted-foreground">
                AI Chatbot Platform
              </p>
              <p className="text-xs text-muted-foreground/70">
                v1.0.0
              </p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};