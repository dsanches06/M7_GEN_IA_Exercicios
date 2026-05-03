import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Schema para dashboard de sentimento
const SentimentDashboardSchema = z.object({
  team_mood: z.enum(["happy", "stressed", "neutral"]),
  main_blocker: z.string(),
  burnout_risk: z.boolean(),
  recommendations: z.array(z.string()),
});

// ❌ LINHA REMOVIDA: type SentimentDashboard = z.infer<typeof SentimentDashboardSchema>;

export async function analyzeTeamSentiment() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
    });

    const comments = [
      "A sprint está muito pesada, não estou a conseguir acompanhar",
      "Adorei o novo design, ótimo trabalho!",
      "O servidor caiu novamente, estou frustrado",
      "Consegui terminar a tarefa antes do prazo",
      "A reunião foi muito longa e improdutiva",
      "Preciso de férias urgentemente",
      "O cliente ficou muito satisfeito com o resultado",
      "Falta comunicação entre os departamentos",
      "Estou entusiasmado com o novo projeto",
      "As reuniões diárias são excessivas",
    ];

    const commentsList = comments.map((c, i) => `${i + 1}. "${c}"`).join("\n");

    const prompt = `Analise os seguintes comentários e gere um relatório em JSON: ${commentsList}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsed = JSON.parse(responseText);
    const dashboard = SentimentDashboardSchema.parse(parsed);

    const moodEmoji = { happy: "😊", stressed: "😰", neutral: "😐" };

    console.log(
      `\n${moodEmoji[dashboard.team_mood]} Estado da Equipa: ${dashboard.team_mood.toUpperCase()}`,
    );
    console.log(`⚠️ Principal Bloqueador: ${dashboard.main_blocker}`);
    console.log(
      `🔴 Risco de Burnout: ${dashboard.burnout_risk ? "SIM" : "NÃO"}`,
    );
    console.log("📋 Recomendações:");
    dashboard.recommendations.forEach((rec, i) =>
      console.log(`  ${i + 1}. ${rec}`),
    );

    return dashboard;
  } catch (error) {
    console.error("❌ Erro na análise de sentimento:", error.message);
    throw error;
  }
}

export function setupSentimentRoutes(app) {
  app.get("/dashboard/sentiment", async (req, res) => {
    try {
      const dashboard = await analyzeTeamSentiment();
      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
