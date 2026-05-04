import { motion, AnimatePresence } from "framer-motion";

export default function ConversationSidebar({
  open,
  conversations = [],
  activeConversationId,
  onClose,
  onSelectConversation,
  onNewChat,
  theme,
}) {
  const isDark = theme === "dark";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="sidebar"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-2xl border-r border-gray-200 overflow-y-auto"
          style={{ backgroundColor: isDark ? "#111" : "#ffffff" }}
        >
          <div className={`px-4 py-4 border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold">Histórico de Conversas</h2>
                <p className="text-xs opacity-70">Selecione uma conversa para abrir</p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-[#b4b4b4]" : "hover:bg-black/10 text-gray-600"}`}
              >
                ×
              </button>
            </div>
            <button
              onClick={() => {
                onNewChat();
                onClose();
              }}
              className="mt-4 w-full rounded-xl px-3 py-2 text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Nova Conversa
            </button>
          </div>

          <div className="p-4 space-y-3">
            {conversations.length === 0 ? (
              <div className="text-sm opacity-60">Nenhuma conversa encontrada.</div>
            ) : (
              conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                return (
                  <button
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation)}
                    aria-current={isActive ? "true" : undefined}
                    className={`w-full text-left rounded-2xl p-3 transition-colors border ${
                      isActive
                        ? "border-blue-500 bg-blue-100 text-blue-900"
                        : isDark
                        ? "border-gray-800 bg-[#121212] hover:bg-white/5 text-white"
                        : "border-gray-200 bg-white hover:bg-gray-50 text-black"
                    }`}
                  >
                    <p className="font-semibold truncate">{conversation.title || `Conversa #${conversation.id}`}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(conversation.created_at).toLocaleString()}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
