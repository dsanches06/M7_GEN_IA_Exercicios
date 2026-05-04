import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatUI";

export default function Lab03Panel({ selectedExercise, onBack }) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isDark = theme === "dark";

  if (!selectedExercise) return null;

  const handleSend = async (text) => {
    console.log("📤 User enviou:", text);
    console.log("🎯 Exercise action:", selectedExercise.action);
    
    if (!text.trim() || !selectedExercise.action) {
      console.error("❌ Texto vazio ou action inexistente");
      return;
    }

    setMessages(prev => [...prev, { role: "user", content: text }]);
    setIsLoading(true);
    let fullResponse = "";

    try {
      if (selectedExercise.badge === "Streaming") {
        console.log("⏳ Streaming iniciado...");
        const stream = await selectedExercise.action(text);
        
        for await (const chunk of stream) {
          console.log("📥 Chunk recebido:", chunk);
          if (chunk.chunk) {
            fullResponse += chunk.chunk;
            setMessages(prev => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.role === "bot") {
                return [...prev.slice(0, -1), { role: "bot", content: fullResponse }];
              }
              return [...prev, { role: "bot", content: fullResponse }];
            });
          }
          if (chunk.error) {
            throw new Error(chunk.error);
          }
          if (chunk.status === "completed") {
            if (chunk.fullResponse) fullResponse = chunk.fullResponse;
            if (chunk.full_summary) fullResponse = chunk.full_summary;
            if (chunk.agenda) fullResponse = `📋 Agenda Semanal:\n${JSON.stringify(chunk.agenda, null, 2)}`;
          }
        }
      } else {
        console.log("📦 JSON iniciado...");
        const result = await selectedExercise.action(text);
        console.log("✅ Resultado:", result);
        fullResponse = `✅ Resultado:\n${JSON.stringify(result, null, 2)}`;
        setMessages(prev => [...prev, { role: "bot", content: fullResponse }]);
      }
    } catch (error) {
      console.error("❌ Erro:", error);
      const errorMsg = `❌ Erro: ${error.message || "Falha ao processar"}`;
      setMessages(prev => [...prev, { role: "bot", content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`h-full flex flex-col ${isDark ? "bg-[#0d0d0d]" : "bg-gray-50"}`}
    >
      {/* Header do Exercício */}
      <div
        className={`px-6 py-4 border-b flex items-center gap-4 ${
          isDark ? "bg-[#111] border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <button
          onClick={onBack}
          className="p-2 hover:bg-blue-500/10 rounded-full text-blue-500 transition"
        >
          ←
        </button>
        <div>
          <p className="opacity-50 text-xs uppercase font-bold tracking-tighter">
            Lab 03
          </p>
          <p className={`font-bold ${isDark ? "text-white" : "text-black"}`}>
            {selectedExercise.title}
          </p>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {selectedExercise.description}
          </p>
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <MessageList messages={messages} isTyping={isLoading} />
        <ChatInput
          onSend={handleSend}
          placeholder={selectedExercise.placeholder || "Envie uma mensagem..."}
        />
      </div>
    </motion.div>
  );
}
