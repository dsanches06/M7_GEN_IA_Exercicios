import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatUI";
import { LABS_DATA } from "@/constants/labs";

export default function Lab03Panel({
  selectedExercise: initialExercise,
  onBack,
}) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(initialExercise);
  const isDark = theme === "dark";

  // Obter lista de exercícios do Lab 03
  const labExercises =
    LABS_DATA["Lab 03 - ClickBot Builder: Workshop Prático GenAI"]?.[0] || {};
  const exercisesList = Object.values(labExercises).flat();

  // Auto-executar análise de sentimento ao selecionar exercício 6
  useEffect(() => {
    if (selectedExercise?.id === 6 && messages.length === 0) {
      handleSend("");
    }
  }, [selectedExercise?.id]);

  if (!selectedExercise) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`h-full flex flex-col ${isDark ? "bg-[#0d0d0d]" : "bg-gray-50"}`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${
            isDark ? "bg-[#111] border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <button
            onClick={onBack}
            className="p-2 hover:bg-blue-500/10 rounded-full text-blue-500 transition mb-4"
          >
            ←
          </button>
          <p className="opacity-50 text-xs uppercase font-bold tracking-tighter">
            Lab 03
          </p>
          <p
            className={`font-bold text-lg ${isDark ? "text-white" : "text-black"}`}
          >
            ClickBot Builder: Workshop Prático GenAI
          </p>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Escolha um exercício para testar
          </p>
        </div>

        {/* Lista de Exercícios */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {exercisesList.map((exercise) => (
              <motion.button
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-lg border-2 text-left transition-all ${
                  isDark
                    ? "bg-[#1a1a1a] border-gray-700 hover:border-blue-500"
                    : "bg-white border-gray-200 hover:border-blue-500"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <p
                    className={`font-bold text-lg ${isDark ? "text-white" : "text-black"}`}
                  >
                    {exercise.title}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      exercise.badge === "Streaming"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {exercise.badge}
                  </span>
                </div>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {exercise.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  const handleSend = async (text) => {
    console.log("📤 User enviou:", text);
    console.log("🎯 Exercise:", selectedExercise.title);

    // Para exercício 6 (Sentiment), ignorar input de texto
    let shouldProceed = true;

    if (selectedExercise.id === 6) {
      // Exercício 6 não precisa de input, executa diretamente
      shouldProceed = true;
    } else if (!text.trim() || !selectedExercise.action) {
      console.error("❌ Texto vazio ou action inexistente");
      return;
    }

    if (selectedExercise.id !== 6) {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
    }

    setIsLoading(true);
    let fullResponse = "";

    try {
      if (selectedExercise.badge === "Streaming") {
        console.log("⏳ Streaming iniciado...");

        // Preparar input baseado no exercício
        let input = text;
        if (selectedExercise.id === 3) {
          // Exercício 3: Meeting transcriber
          input = { notes: text, project_id: 1 };
        } else if (selectedExercise.id === 5) {
          // Exercício 5: Weekly planner - converter para array de tasks
          input = [{ task: text, priority: "medium" }];
        }

        const stream = await selectedExercise.action(input);

        for await (const chunk of stream) {
          console.log("📥 Chunk recebido:", chunk);

          if (chunk.text) {
            fullResponse += chunk.text;
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.role === "bot") {
                return [
                  ...prev.slice(0, -1),
                  { role: "bot", content: fullResponse },
                ];
              }
              return [...prev, { role: "bot", content: fullResponse }];
            });
          } else if (chunk.chunk) {
            // Fallback para chunk.chunk se text não existir
            fullResponse += chunk.chunk;
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.role === "bot") {
                return [
                  ...prev.slice(0, -1),
                  { role: "bot", content: fullResponse },
                ];
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
            if (chunk.agenda) {
              fullResponse = `📋 Agenda Semanal:\n${JSON.stringify(chunk.agenda, null, 2)}`;
            }

            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.role === "bot") {
                return [
                  ...prev.slice(0, -1),
                  { role: "bot", content: fullResponse },
                ];
              }
              return [...prev, { role: "bot", content: fullResponse }];
            });
          }
        }
      } else {
        // JSON response
        console.log("📦 JSON response...");
        let result;

        if (selectedExercise.id === 2) {
          // Task Parser
          result = await selectedExercise.action(text);
        } else if (selectedExercise.id === 4) {
          // Bug Triage
          result = await selectedExercise.action(text);
        } else if (selectedExercise.id === 6) {
          // Sentiment Dashboard - sem parâmetro de texto
          result = await selectedExercise.action();
        } else {
          result = await selectedExercise.action(text);
        }

        console.log("✅ Resultado:", result);

        // Formatar a resposta
        let formattedResponse = fullResponse;

        if (selectedExercise.id === 6) {
          // Formato especial para Sentiment Dashboard
          formattedResponse = `
📊 **ANÁLISE DE SENTIMENTO DOS 20 ÚLTIMOS COMENTÁRIOS**
═══════════════════════════════════════════════════════

${JSON.stringify(result, null, 2)}
          `;
        } else {
          formattedResponse = `✅ ${selectedExercise.title}:\n${JSON.stringify(result, null, 2)}`;
        }

        setMessages((prev) => [
          ...prev,
          { role: "bot", content: formattedResponse },
        ]);
      }
    } catch (error) {
      console.error("❌ Erro:", error);
      const errorMsg = `❌ Erro: ${error.message || "Falha ao processar"}`;
      setMessages((prev) => [...prev, { role: "bot", content: errorMsg }]);
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
          onClick={() => setSelectedExercise(null)}
          className="p-2 hover:bg-blue-500/10 rounded-full text-blue-500 transition"
          title="Voltar para lista de exercícios"
        >
          ←
        </button>
        <div>
          <p className="opacity-50 text-xs uppercase font-bold tracking-tighter">
            Lab 03 - Exercício {selectedExercise.id}
          </p>
          <p className={`font-bold ${isDark ? "text-white" : "text-black"}`}>
            {selectedExercise.title}
          </p>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {selectedExercise.description}
          </p>
        </div>
        <span
          className={`ml-auto px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            selectedExercise.badge === "Streaming"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-purple-500/20 text-purple-400"
          }`}
        >
          {selectedExercise.badge}
        </span>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <MessageList messages={messages} isTyping={isLoading} />
        <ChatInput
          onSend={handleSend}
          placeholder={
            selectedExercise.id === 6
              ? "Clique para analisar os 20 últimos comentários..."
              : selectedExercise.placeholder || "Envie uma mensagem..."
          }
        />
      </div>
    </motion.div>
  );
}
