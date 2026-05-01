import { useTheme } from "@/context/ThemeContext";

export default function MessageList({ messages, isTyping }) {
  const { theme } = useTheme();

  return (
    /* Aumentei o padding inferior para não bater no input */
    <div className="pb-44 pt-6 overflow-y-auto h-full">
      {/* Container central que dita a largura do chat */}
      <div className="max-w-3xl mx-auto px-4 space-y-10">
        {messages.map((msg, index) => {
          const isLast = index === messages.length - 1;
          const isBot = msg.role === "bot";

          return (
            <div key={index} className="flex items-start gap-4 group">
              {/* Avatar circular (Verde para Bot, Roxo/Cinza para User) */}
              <div className={`h-9 w-9 rounded-full flex shrink-0 items-center justify-center text-[10px] font-bold shadow-sm transition-colors ${
                isBot 
                  ? "bg-[#19c37d] text-white" 
                  : theme === "dark" ? "bg-[#5436da] text-white" : "bg-gray-200 text-gray-700"
              }`}>
                {isBot ? "AI" : "U"}
              </div>

              {/* Bloco de Texto */}
              <div className="flex-1 min-w-0 pt-1.5">
                <div className={`text-[18px] leading-relaxed transition-colors duration-300 ${
                  theme === "dark" ? "text-[#ececec]" : "text-[#0d0d0d]"
                }`}>
                  {msg.content}

                  {/* Cursor no final da mensagem do Bot */}
                  {isBot && isLast && isTyping && (
                    <span className={`inline-block w-[2px] h-[1.1em] ml-1.5 align-middle animate-cursor-blink ${
                      theme === "dark" ? "bg-white" : "bg-black"
                    }`} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
