import { motion } from "framer-motion";

export default function LabsPanel({ labs, onSelectLab, theme }) {
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.keys(labs).map((labKey, index) => {
        // CORREÇÃO: Calcula o total de exercícios somando todas as partes/lab01...
        // labs[labKey][0] acede ao objeto de categorias, Object.values pega nos arrays de exercícios
        const totalExercises = Object.values(labs[labKey][0]).flat().length;

        return (
          <motion.button
            key={labKey}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectLab(labKey)}
            className={`p-6 rounded-2xl border-2 text-left transition-all h-52 flex flex-col justify-between shadow-xl ${
              isDark 
                ? "bg-[#1a1a1a] border-gray-800 hover:border-blue-500" 
                : "bg-white border-gray-100 hover:border-blue-400"
            }`}
          >
            <div>
              <div className={`w-10 h-10 rounded-lg mb-4 flex items-center justify-center ${
                isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
              }`}>
                {index + 1}
              </div>
              <h3 className="text-xl font-bold leading-tight">{labKey}</h3>
              <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {totalExercises} Exercícios GenAI
              </p>
            </div>
            <div className="flex items-center text-blue-500 font-bold text-sm">
              Explorar Módulo →
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
