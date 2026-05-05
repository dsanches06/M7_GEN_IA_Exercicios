import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import ChatInput from "@/components/ChatUI";
import AudioUpload from "@/components/AudioUpload";
import MessageList from "@/components/MessageList";
import HeaderUI from "@/components/HeaderUI";
import ConversationSidebar from "@/components/ConversationSidebar";
import ExercisesPanel from "@/components/ExercisesPanel";
import LabsPanel from "@/components/LabsPanel";
import { LABS_DATA } from "@/constants/labs";
import { analyzeLatestComments } from "@/services/apiService";

export default function ChatPage() {
  const [activeLab, setActiveLab] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Limpar mensagens ao mudar de lab ou exercício
  useEffect(() => {
    setMessages([]);
  }, [activeLab, selectedExercise]);

  // Carregar histórico de conversas
  const loadConversations = async () => {
    try {
      const response = await fetch("http://localhost:3000/conversations/");
      if (response.ok) {
        const data = await response.json();
        // Ordenar em ordem decrescente por ID (mais recentes primeiro)
        const sortedData = data.sort((a, b) => b.id - a.id);
        setConversations(sortedData);
        if (sortedData.length > 0) {
          setActiveConversationId(sortedData[0].id);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar conversas:", error);
    }
  };

  // Selecionar conversa
  const handleSelectConversation = (conversation) => {
    setActiveConversationId(conversation.id);
    setMessages([]); // Limpar mensagens ao mudar de conversa
    setSidebarOpen(false);

    // Carregar mensagens da conversa
    loadConversationMessages(conversation.id);
  };

  // Carregar mensagens de uma conversa específica
  const loadConversationMessages = async (conversationId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/chat/conversation/${conversationId}`,
      );
      if (response.ok) {
        const data = await response.json();
        // Se data é um array, usa directamente
        const messages = Array.isArray(data) ? data : data.messages || [];
        // Converter para o formato do app (array de objetos com role e content)
        const formattedMessages = messages.map((msg) => ({
          role: msg.role || (msg.role_id === 1 ? "user" : "bot"), // Ajusta conforme a structure real
          content: msg.content,
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
  };

  // Deletar conversa
  const handleDeleteConversation = async (conversationId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/conversations/${conversationId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        loadConversations();
        if (activeConversationId === conversationId) {
          setMessages([]);
          setActiveConversationId(null);
        }
      }
    } catch (error) {
      console.error("Erro ao deletar conversa:", error);
    }
  };

  // Criar nova conversa
  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    loadConversations();
  };

  const handleSend = async (text) => {
    if (!text.trim() || !selectedExercise) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsTyping(true);
    let botResponse = "";

    try {
      if (!selectedExercise.action) {
        throw new Error("Ação não configurada");
      }

      if (selectedExercise.badge === "Streaming") {
        // Para exercício 1, passar conversationId
        const actionArg = selectedExercise.id === 1 ? text : text;

        const stream = await (selectedExercise.id === 1
          ? selectedExercise.action(text, activeConversationId)
          : selectedExercise.action(text));

        for await (const chunk of stream) {
          if (chunk.chunk) {
            botResponse += chunk.chunk;
            setMessages((prev) => {
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
        setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ Erro ao processar solicitação." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Função para enviar áudio (Exercício 3)
  const handleSendAudio = async (audioBlob) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: "🎤 Áudio enviado" },
    ]);
    setIsTyping(true);
    let botResponse = "";

    try {
      if (!selectedExercise.action) {
        throw new Error("Ação não configurada");
      }

      // Converter blob para base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Audio = reader.result.split(",")[1];

        // Enviar áudio como base64
        const stream = await selectedExercise.action({
          audio: base64Audio,
          mimeType: audioBlob.type,
        });

        for await (const chunk of stream) {
          if (chunk.chunk) {
            botResponse += chunk.chunk;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              return last?.role === "bot"
                ? [...prev.slice(0, -1), { role: "bot", content: botResponse }]
                : [...prev, { role: "bot", content: botResponse }];
            });
          }
        }
      };
      reader.onerror = () => {
        throw new Error("Erro ao ler áudio");
      };
      reader.readAsDataURL(audioBlob);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "❌ Erro ao processar áudio." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Função para analisar últimos 20 comentários (Exercício 6)
  const handleAnalyzeLatestComments = async () => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: "📊 Analisando últimos 20 comentários..." },
    ]);
    setIsTyping(true);

    try {
      const response = await analyzeLatestComments();
      const { result } = response;

      const botResponse = `✅ Análise dos Últimos ${result.totalComments} Comentários:\n\n${JSON.stringify(result, null, 2)}`;
      setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `❌ Erro ao analisar comentários: ${e.message}`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className={`h-screen flex flex-col transition-colors ${isDark ? "bg-[#0d0d0d] text-white" : "bg-gray-50 text-black"}`}
    >
      <HeaderUI
        onNewChat={() => {
          setActiveLab(null);
          setSelectedExercise(null);
          handleNewChat();
        }}
        onToggleSidebar={() => {
          setSidebarOpen(!sidebarOpen);
          if (!sidebarOpen) loadConversations();
        }}
      />

      {/* ConversationSidebar - Sempre disponível */}
      <>
        {/* Overlay visual - sem onClick */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/30 pointer-events-none" />
        )}
        {/* Sidebar */}
        <ConversationSidebar
          open={sidebarOpen}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onClose={() => setSidebarOpen(false)}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          theme={theme}
        />
      </>

      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {/* 1. SELETOR DE LABS */}
          {!activeLab && (
            <motion.div
              key="labs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 max-w-6xl mx-auto h-full overflow-y-auto"
            >
              <h2 className="text-4xl font-black mb-2">Laboratórios</h2>
              <p className="text-gray-500 mb-10">
                Escolha um módulo para praticar Inteligência Artificial
                Generativa.
              </p>
              <LabsPanel
                labs={LABS_DATA}
                onSelectLab={setActiveLab}
                theme={theme}
              />
            </motion.div>
          )}

          {/* 2. SELETOR DE EXERCÍCIOS */}
          {activeLab && !selectedExercise && (
            <motion.div
              key="ex"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-8 max-w-6xl mx-auto h-full overflow-y-auto"
            >
              <button
                onClick={() => setActiveLab(null)}
                className="mb-6 flex items-center gap-2 text-blue-500 font-bold hover:gap-3 transition-all"
              >
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
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col h-full"
            >
              <div
                className={`px-6 py-3 border-b flex items-center gap-4 ${isDark ? "bg-[#111] border-gray-800" : "bg-white border-gray-200"}`}
              >
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="p-2 hover:bg-blue-500/10 rounded-full text-blue-500 transition"
                >
                  ←
                </button>
                <div className="text-sm">
                  <p className="opacity-50 text-xs uppercase font-bold tracking-tighter">
                    {activeLab}
                  </p>
                  <p className="font-bold">{selectedExercise.title}</p>
                </div>
              </div>

              <div className="flex-1 overflow-hidden relative flex flex-col">
                <MessageList messages={messages} isTyping={isTyping} />

                {/* Container Inferior: Input + Botão Extra lado a lado */}
                <div
                  className={`px-6 py-3 border-t flex items-center gap-3 ${isDark ? "bg-[#111] border-gray-800" : "bg-white border-gray-200"}`}
                >
                  <div className="flex-1">
                    {selectedExercise.id === 3 ? (
                      <AudioUpload
                        onSendAudio={handleSendAudio}
                        isLoading={isTyping}
                      />
                    ) : (
                      <ChatInput
                        onSend={handleSend}
                        placeholder={selectedExercise.placeholder}
                      />
                    )}
                  </div>

                  {/* Botão Redondo para Exercício 6 ao lado do input */}
                  {selectedExercise.id === 6 && (
                    <button
                      onClick={handleAnalyzeLatestComments}
                      disabled={isTyping}
                      title="Analisar Últimos 20 Comentários"
                      className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 ${
                        isDark
                          ? "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 text-white"
                          : "bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white"
                      }`}
                    >
                      <span className="text-xl">📊</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
