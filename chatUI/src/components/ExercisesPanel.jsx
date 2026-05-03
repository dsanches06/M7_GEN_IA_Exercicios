// components/ExercisesPanel.jsx
export default function ExercisesPanel({
  exercises = [],
  selectedExercise,
  onSelectExercise,
  theme,
}) {
  const isDark = theme === "dark";



  return (
    <div
      className={`p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-colors ${
        isDark ? "bg-[#1a1a1a]" : "bg-gray-100"
      }`}
    >
      {exercises.map((exercise) => {
        const isActive = selectedExercise?.id === exercise.id;

        return (
          console.log("Renderizando exercício:", exercise), // Log para debug
          <button
            key={exercise.id}
            onClick={() => onSelectExercise(exercise)}
            className={`p-4 rounded-lg transition-all text-left border-2 ${
              isActive
                ? isDark
                  ? "bg-blue-600 border-blue-400 text-white"
                  : "bg-blue-500 border-blue-300 text-white"
                : isDark
                  ? "bg-[#2a2a2a] hover:bg-[#3a3a3a] border-[#444] text-white"
                  : "bg-white hover:bg-gray-50 border-gray-300 text-gray-900"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold">{exercise.title}</h3>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-1 rounded text-white ${
                  exercise.badge === "Streaming"
                    ? "bg-purple-600"
                    : "bg-blue-700"
                }`}
              >
                {exercise.badge}
              </span>
            </div>
            <p
              className={`text-sm ${
                isActive
                  ? "text-blue-50"
                  : isDark
                    ? "text-gray-400"
                    : "text-gray-600"
              }`}
            >
              {exercise.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
