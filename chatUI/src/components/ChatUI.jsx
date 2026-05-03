import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function ChatInput({ onSend, placeholder = "Pergunte qualquer coisa" }) {
  const [value, setValue] = useState("");
  const { theme } = useTheme();

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-20">
      <div
        className={`flex items-center justify-between rounded-full px-3 py-2.5 shadow-2xl border transition-colors duration-300 ${
          theme === "dark"
            ? "bg-[#212121] border-white/5"
            : "bg-[#f4f4f4] border-black/5"
        }`}
      >
        {/* 1. Botão + */}
        <button
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all ${
            theme === "dark"
              ? "text-white hover:bg-white/10"
              : "text-gray-600 hover:bg-black/10"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        {/* 2. Campo de Texto */}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          type="text"
          placeholder={placeholder}
          className={`mx-3 flex-1 bg-transparent text-[20px] outline-none min-w-0 transition-colors ${
            theme === "dark"
              ? "text-[#ececec] placeholder:text-[#9b9b9b]"
              : "text-black placeholder:text-gray-400"
          }`}
        />

        {/* 3. Grupo de Ações (Mic, Voz e Enviar) */}
        <div className="flex items-center gap-1 shrink-0 pr-1">
          {/* O Microfone fica sempre visível (estilo ChatGPT) */}
          <button
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
              theme === "dark"
                ? "text-[#9b9b9b] hover:bg-white/10"
                : "text-gray-500 hover:bg-black/10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="15"
              viewBox="0 0 384 512"
            >
              <path
                /* Alterado de #ffffff para currentColor */
                fill="currentColor"
                d="M192 0C139 0 96 43 96 96l0 128c0 53 43 96 96 96s96-43 96-96l0-128c0-53-43-96-96-96zM48 184c0-13.3-10.7-24-24-24S0 170.7 0 184l0 40c0 97.9 73.3 178.7 168 190.5l0 49.5-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-49.5c94.7-11.8 168-92.6 168-190.5l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 79.5-64.5 144-144 144S48 303.5 48 224l0-40z"
              />
            </svg>
          </button>

          <AnimatePresence mode="wait">
            {value.trim() ? (
              /* BOTÃO ENVIAR */
              <motion.button
                key="send"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleSend}
                className={`flex items-center justify-center h-10 w-10 rounded-full transition-colors ${
                  theme === "dark"
                    ? "bg-white text-black"
                    : "bg-black text-white"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </motion.button>
            ) : (
              /* BOTÃO VOZ */
              <motion.button
                key="voice"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`flex items-center justify-center h-10 px-3 rounded-full gap-2 transition-colors ${
                  theme === "dark"
                    ? "text-[#9b9b9b] hover:bg-white/10"
                    : "text-gray-500 hover:bg-black/10"
                }`}
              >
                <div className="flex items-center gap-[2px]">
                  <div
                    className={`w-[2px] h-3 rounded-full animate-bounce ${theme === "dark" ? "bg-white" : "bg-black"}`}
                  ></div>
                  <div
                    className={`w-[2px] h-5 rounded-full animate-bounce [animation-delay:0.1s] ${theme === "dark" ? "bg-white" : "bg-black"}`}
                  ></div>
                  <div
                    className={`w-[2px] h-3 rounded-full animate-bounce [animation-delay:0.2s] ${theme === "dark" ? "bg-white" : "bg-black"}`}
                  ></div>
                </div>
                <span className="text-sm font-medium">Voz</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p
        className={`text-[12px] text-center mt-3 transition-colors ${
          theme === "dark" ? "text-[#9b9b9b]" : "text-gray-400"
        }`}
      >
        O Bot pode cometer erros. Considere verificar informações importantes.
      </p>
    </div>
  );
}
