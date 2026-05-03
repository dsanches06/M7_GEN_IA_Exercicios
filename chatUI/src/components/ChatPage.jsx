import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import ChatInput from "@/components/ChatUI";
import MessageList from "@/components/MessageList";
import HeaderUI from "@/components/HeaderUI";
import ExercisesPanel from "@/components/ExercisesPanel";
import LabsPanel from "@/components/LabsPanel";
import { LABS_DATA } from "@/constants/labs";

export default function ChatPage() {
  const [activeLab, setActiveLab] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Limpar mensagens ao mudar de lab ou exercício
  useEffect(() => { 
    setMessages([]); 
  }, [activeLab, selectedExercise]);

  const handleSend = async (text) => {
    if (!text.trim() || !selectedExercise) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setIsTyping(true);
    let botResponse = "";

    try {
      if (!selectedExercise.action) {
        throw new Error("Ação não configurada");
      }

      if (selectedExercise.badge === "Streaming") {
        const stream = await selectedExercise.action(text);
        for await (const chunk of stream) {
          if (chunk.chunk) {
            botResponse += chunk.chunk;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              return last?.role === "bot" 
                ? [...prev.slice(0, -1), { role: "bot", content: botResponse }]
                : [...prev, { role: "bot", content: botResponse }];
            });
          }
        }
      } else {
        const result = await selectedExercise.action(text);
        botResponse = `✅ Resultado JSON:\n${JSON.stringify(result, null, 2)}`;
        setMessages(prev => [...prev, { role: "bot", content: botResponse }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "bot", content: "❌ Erro ao processar solicitação." }]);
    } finally { 
      setIsTyping(false); 
    }
  };

  return (
    <div className={`h-screen flex flex-col transition-colors ${isDark ? "bg-[#0d0d0d] text-white" : "bg-gray-50 text-black"}`}>
      <HeaderUI onNewChat={() => { setActiveLab(null); setSelectedExercise(null); }} />

      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          
          {/* 1. SELETOR DE LABS */}
          {!activeLab && (
            <motion.div key="labs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-8 max-w-6xl mx-auto h-full overflow-y-auto">
              <h2 className="text-4xl font-black mb-2">Laboratórios</h2>
              <p className="text-gray-500 mb-10">Escolha um módulo para praticar Inteligência Artificial Generativa.</p>
              <LabsPanel labs={LABS_DATA} onSelectLab={setActiveLab} theme={theme} />
            </motion.div>
          )}

          {/* 2. SELETOR DE EXERCÍCIOS */}
          {activeLab && !selectedExercise && (
            <motion.div key="ex" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="p-8 max-w-6xl mx-auto h-full overflow-y-auto">
              <button onClick={() => setActiveLab(null)} className="mb-6 flex items-center gap-2 text-blue-500 font-bold hover:gap-3 transition-all">
                ← VOLTAR AOS MÓDULOS
              </button>
              <h2 className="text-4xl font-black mb-8">{activeLab}</h2>
              <ExercisesPanel 
                // CORREÇÃO: Acede ao primeiro objeto do array e achata as partes (parte01, lab01, etc)
                exercises={Object.values(LABS_DATA[activeLab][0]).flat()} 
                selectedExercise={selectedExercise} 
                onSelectExercise={setSelectedExercise} 
                theme={theme} 
              />
            </motion.div>
          )}

          {/* 3. INTERFACE DE CHAT */}
          {selectedExercise && (
            <motion.div key="chat" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="flex flex-col h-full">
              <div className={`px-6 py-3 border-b flex items-center gap-4 ${isDark ? "bg-[#111] border-gray-800" : "bg-white border-gray-200"}`}>
                <button onClick={() => setSelectedExercise(null)} className="p-2 hover:bg-blue-500/10 rounded-full text-blue-500 transition">←</button>
                <div className="text-sm">
                  <p className="opacity-50 text-xs uppercase font-bold tracking-tighter">{activeLab}</p>
                  <p className="font-bold">{selectedExercise.title}</p>
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative flex flex-col">
                <MessageList messages={messages} isTyping={isTyping} />
                <ChatInput onSend={handleSend} placeholder={selectedExercise.placeholder} />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
