import { useState } from "react";
import { useTheme } from "@/context/ThemeContext"; // Importa o hook do contexto
import ChatInput from "@/components/ChatUI";
import MessageList from "@/components/MessageList";
import HeaderUI from "@/components/HeaderUI";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // 1. Puxa o tema diretamente do contexto global
  const { theme } = useTheme();

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    setTimeout(() => {
      const botMessage = { 
        role: "bot", 
        content: "Resposta recebida com sucesso! 🤖" 
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // 2. Função de limpar chat simplificada (as props de tema saíram)
  const handleNewChat = () => {
    setMessages([]);
    setIsTyping(false);
  };

  return (
    <div className={`h-screen flex flex-col transition-colors duration-500 ${
      theme === "dark" ? "bg-[#0d0d0d] text-white" : "bg-white text-black"
    }`}>
      
      {/* 3. Removemos as props theme e toggleTheme daqui, 
          pois o HeaderUI já as pega sozinho do Contexto */}
      <HeaderUI onNewChat={handleNewChat} />

      <main className="flex-1 overflow-hidden relative">
        <MessageList messages={messages} isTyping={isTyping} />
      </main>

      <ChatInput onSend={handleSend} />
    </div>
  );
}
