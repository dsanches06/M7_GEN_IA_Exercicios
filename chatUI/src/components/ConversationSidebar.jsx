import { motion } from "framer-motion";

export default function ConversationSidebar({
  open,
  conversations = [],
  activeConversationId,
  onClose,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  theme,
}) {
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={open ? { x: 0, opacity: 1 } : { x: -300, opacity: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className={`fixed inset-y-0 left-0 z-50 w-80 shadow-2xl border-r overflow-y-auto pointer-events-none ${
        open ? "pointer-events-auto" : ""
      } ${
        isDark 
          ? "bg-[#111] border-gray-800" 
          : "bg-white border-gray-200"
      }`}
    >
          {/* Header Sticky */}
          <div className={`sticky top-0 px-6 py-4 border-b ${isDark ? "border-gray-800 bg-[#111]" : "border-gray-200 bg-white"}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Histórico</h2>
                <p className="text-xs opacity-70">Conversas salvas</p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? "hover:bg-white/10 text-gray-400" 
                    : "hover:bg-black/10 text-gray-600"
                }`}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Lista de conversas */}
          <div className="p-3 space-y-2">
            {conversations.length === 0 ? (
              <div className={`text-sm text-center py-8 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Nenhuma conversa encontrada
              </div>
            ) : (
              conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                return (
                  <div
                    key={conversation.id}
                    className={`rounded-lg p-3 transition-all border-l-4 group cursor-pointer ${
                      isActive
                        ? isDark
                          ? "bg-blue-900/30 border-l-blue-500 text-blue-300"
                          : "bg-blue-50 border-l-blue-500 text-blue-900"
                        : isDark
                          ? "bg-gray-900/50 border-l-gray-700 hover:bg-gray-800/50 text-gray-300"
                          : "bg-gray-50 border-l-gray-300 hover:bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => onSelectConversation(conversation)}
                        className="flex-1 text-left min-w-0"
                      >
                        <p className="font-semibold break-words text-sm leading-snug">{conversation.title || "Sem título"}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {new Date(conversation.created_at).toLocaleDateString("pt-PT")}
                        </p>
                      </button>
                      {/* Botão de remover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                        className={`p-1.5 rounded flex-shrink-0 transition-colors mt-0.5 ${
                          isDark
                            ? "hover:bg-red-900/30 text-red-400"
                            : "hover:bg-red-100 text-red-600"
                        }`}
                        title="Remover conversa"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
  );
}
