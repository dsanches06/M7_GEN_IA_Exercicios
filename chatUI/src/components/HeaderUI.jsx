import { useTheme } from "@/context/ThemeContext"; // Ajuste o caminho se necessário

export default function HeaderUI({ onNewChat }) {
  // Agora o componente busca o estado globalmente
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 flex items-center justify-end px-4 shrink-0 bg-transparent">
      <div className="flex items-center gap-1">
        
        {/* 1. Ícone de Histórico/Explorar */}
        <button 
          title="Histórico"
          className={`p-2 rounded-lg transition-colors ${
            theme === "dark" ? "hover:bg-white/10 text-[#b4b4b4]" : "hover:bg-black/10 text-gray-600"
          }`}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M19 15l-3 3 3 3"></path>
             <line x1="3" y1="12" x2="18" y2="12"></line>
             <line x1="3" y1="6" x2="18" y2="6"></line>
          </svg>
        </button>

        {/* 2. Ícone de Novo Chat */}
        <button 
          onClick={onNewChat}
          title="Novo Chat"
          className={`p-2 rounded-lg transition-colors ${
            theme === "dark" ? "hover:bg-white/10 text-[#b4b4b4]" : "hover:bg-black/10 text-gray-600"
          }`}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        {/* 3. Alternador de Tema */}
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-lg text-xl transition-colors ml-1 ${
            theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/10"
          }`}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

      </div>
    </header>
  );
}
