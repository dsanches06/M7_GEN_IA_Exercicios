import { analyzeTeamSentiment } from "./src/services/aiExercisesService.js";

async function runSentimentAnalysis() {
  try {
    console.log("🔍 Iniciando análise de sentimento da equipa...");
    const dashboard = await analyzeTeamSentiment();
    console.log("✅ Análise concluída!");
    console.log(JSON.stringify(dashboard, null, 2));
  } catch (error) {
    console.error("❌ Erro ao executar análise:", error.message);
    process.exit(1);
  }
}

runSentimentAnalysis();