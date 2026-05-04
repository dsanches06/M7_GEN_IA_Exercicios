import { useTheme } from "@/context/ThemeContext";

export default function HeaderUI({ onNewChat, onToggleHistory }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 flex items-center justify-end px-4 shrink-0 bg-transparent">
      <div className="flex items-center gap-1">
        {/* 1. Ícone de Histórico */}
        <button
          onClick={onToggleHistory}
          className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-white/10 text-[#b4b4b4]" : "hover:bg-black/10 text-gray-600"}`}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 15l-3 3 3 3"></path>
            <line x1="3" y1="12" x2="18" y2="12"></line>
            <line x1="3" y1="6" x2="18" y2="6"></line>
          </svg>
        </button>

        {/* 2. Ícone de Novo Chat */}
        <button
          onClick={onNewChat}
          className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-white/10 text-[#b4b4b4]" : "hover:bg-black/10 text-gray-600"}`}
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        {/* 3. Alternador de Tema (SVGs em vez de Emojis) */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all ml-1 flex items-center justify-center ${
            theme === "dark"
              ? "hover:bg-white/10 text-[#b4b4b4]"
              : "hover:bg-black/10 text-gray-600"
          }`}
        >
          {theme === "dark" ? (
            /* SOL NÍTIDO E PREENCHIDO (Sun-Bright) */
            <svg
              xmlns="http://w3.org"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M17.66 17.66l1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="M4.93 19.07l1.41-1.41" />
              <path d="M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            /* LUA DO FONT AWESOME - INVERTIDA E NÍTIDA */
            <svg
              viewBox="0 0 512 512"
              className="w-5 h-5 -scale-x-100" /* O -scale-x-100 inverte o ícone horizontalmente */
            >
              <path
                fill="currentColor"
                d="M256 0C114.6 0 0 114.6 0 256S114.6 512 256 512c68.8 0 131.3-27.2 177.3-71.4 7.3-7 9.4-17.9 5.3-27.1s-13.7-14.9-23.8-14.1c-4.9 .4-9.8 .6-14.8 .6-101.6 0-184-82.4-184-184 0-72.1 41.5-134.6 102.1-164.8 9.1-4.5 14.3-14.3 13.1-24.4S322.6 8.5 312.7 6.3C294.4 2.2 275.4 0 256 0z"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
