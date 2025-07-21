import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ChatBot } from "@/components/ChatBot";
import { AdminPanel } from "@/components/AdminPanel";
import { Guestbook } from "@/components/Guestbook";

const Index = () => {
  const [currentView, setCurrentView] = useState("home");

  const renderContent = () => {
    switch (currentView) {
      case "chat":
        return <ChatBot />;
      case "admin":
        return <AdminPanel />;
      case "guestbook":
        return <Guestbook />;
      default:
        return (
          <Hero
            onStartChat={() => setCurrentView("chat")}
            onViewGuestbook={() => setCurrentView("guestbook")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <main className="flex-1 lg:ml-0">
        <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
