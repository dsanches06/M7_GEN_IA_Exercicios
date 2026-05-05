import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function AudioUpload({ onSendAudio, isLoading }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Iniciar gravação
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Erro ao acessar microfone:", error);
      alert("Não foi possível acessar o microfone");
    }
  };

  // Parar gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Upload de arquivo
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioBlob(file);
      setAudioURL(URL.createObjectURL(file));
    }
  };

  // Enviar áudio
  const handleSendAudio = async () => {
    if (!audioBlob) {
      alert("Selecione ou grave um áudio");
      return;
    }
    await onSendAudio(audioBlob);
    setAudioBlob(null);
    setAudioURL(null);
    audioChunksRef.current = [];
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-md p-8 rounded-2xl ${
          isDark
            ? "bg-[#1a1a1a] border border-gray-800"
            : "bg-white border border-gray-200"
        } shadow-xl`}
      >
        <h3 className="text-2xl font-bold mb-6 text-center">🎤 Gravador de Áudio</h3>

        {/* Botões de Gravação */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={startRecording}
            disabled={isRecording || isLoading}
            className={`flex-1 py-3 rounded-lg font-bold transition ${
              isRecording
                ? "bg-red-500 text-white cursor-not-allowed"
                : isDark
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isRecording ? "🔴 Gravando..." : "⏹️ Iniciar"}
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`flex-1 py-3 rounded-lg font-bold transition ${
              !isRecording
                ? "opacity-50 cursor-not-allowed"
                : isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            ⏸️ Parar
          </button>
        </div>

        {/* Upload de Arquivo */}
        <div className="mb-6">
          <label
            className={`block py-4 px-6 rounded-lg border-2 border-dashed text-center cursor-pointer transition ${
              isDark
                ? "border-gray-600 hover:border-blue-500 hover:bg-blue-500/5"
                : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            }`}
          >
            <span className="text-sm font-medium">📁 Ou selecione um arquivo</span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="hidden"
            />
          </label>
        </div>

        {/* Preview de Áudio */}
        {audioURL && (
          <div className="mb-6">
            <p className="text-sm opacity-70 mb-2">🎵 Áudio pronto:</p>
            <audio
              src={audioURL}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: "50px" }}
            />
          </div>
        )}

        {/* Botão Enviar */}
        <button
          onClick={handleSendAudio}
          disabled={!audioBlob || isLoading}
          className={`w-full py-3 rounded-lg font-bold transition ${
            !audioBlob || isLoading
              ? "opacity-50 cursor-not-allowed"
              : isDark
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isLoading ? "⏳ Processando..." : "✅ Enviar Áudio"}
        </button>

        {/* Status */}
        <p className="text-xs text-center mt-4 opacity-60">
          {isRecording && "🎤 Microfone ativo..."}
          {audioBlob && !isRecording && "✓ Áudio pronto para enviar"}
        </p>
      </motion.div>
    </div>
  );
}
