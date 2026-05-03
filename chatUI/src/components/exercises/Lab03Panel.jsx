import { useState } from "react";
import ExercisesPanel from "@/components/ExercisesPanel";
import { useTheme } from "@/context/ThemeContext";

export default function LabsContainer({ EXERCISES_DATA }) {
  const { theme } = useTheme();
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  // Define o primeiro Lab disponível como inicial
  const labsKeys = Object.keys(EXERCISES_DATA);
  const [activeLab, setActiveLab] = useState(labsKeys[0]);

  // CORREÇÃO: Função para achatar a estrutura aninhada (parte01, parte02...)
  const getFlatExercises = (labKey) => {
    if (!EXERCISES_DATA[labKey]) return [];
    // Acedemos ao primeiro objeto do array e juntamos todas as suas partes
    const labContent = EXERCISES_DATA[labKey][0]; 
    return Object.values(labContent).flat();
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-[#0d0d0d] text-white" : "bg-gray-50 text-black"}`}>
      
      {/* Menu de Tabs */}
      <div className={`flex gap-2 p-6 overflow-x-auto border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
        {labsKeys.map((labKey) => (
          <button
            key={labKey}
            onClick={() => {
              setActiveLab(labKey);
              setSelectedExercise(null);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
              activeLab === labKey
                ? "bg-blue-600 text-white"
                : theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {labKey}
          </button>
        ))}
      </div>

      {/* Renderização dos Exercícios */}
      <ExercisesPanel
        exercises={getFlatExercises(activeLab)} // Passa o array plano corrigido
        selectedExercise={selectedExercise}
        onSelectExercise={setSelectedExercise}
        theme={theme}
      />

      {/* Interface de Ação */}
      {selectedExercise && (
        <div className={`p-8 mt-4 border-t ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black mb-4">
              {selectedExercise.title}
            </h2>
            <p className="text-gray-500 mb-6">{selectedExercise.description}</p>
            
            <textarea
              className={`w-full p-4 rounded-xl border-2 outline-none transition-all ${
                theme === "dark" 
                  ? "bg-[#1a1a1a] border-gray-800 focus:border-blue-500" 
                  : "bg-white border-gray-200 focus:border-blue-400"
              }`}
              rows="4"
              placeholder={selectedExercise.placeholder}
            />
          </div>
        </div>
      )}
    </div>
  );
}
