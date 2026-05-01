import ChatPage from "@/components/ChatPage";
import { ThemeProvider }  from "@/context/ThemeContext";

function App() {
  return (
    <div className="min-h-screen bg-[#090909]">
      <ThemeProvider>
        <ChatPage />
      </ThemeProvider>
    </div>
  );
}

export default App;
