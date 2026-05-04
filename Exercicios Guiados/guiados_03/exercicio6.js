/**
 * Exercício 6: Sentiment Analysis Dashboard
 */
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SentimentDashboardSchema = z.object({
  team_mood: z.enum(["happy", "stressed", "neutral"]),
  main_blocker: z.string(),
  burnout_risk: z.boolean(),
  recommendations: z.array(z.string()),
});

// CORREÇÃO ZOD V4: Chamada direta na instância
const schema = SentimentDashboardSchema.toJSONSchema();

export async function analyzeTeamSentiment() {
  try {
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

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-lite", // Atualizado para versão estável sugerida
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analise o sentimento da equipa baseado nestes comentários:\n${commentsList}`
            }
          ]
        }
      ],
      generationConfig: { 
        temperature: 0.2,
        responseMimeType: "application/json",
        responseJsonSchema: schema,
      },
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);
    
    // Validação Zod v4
    const dashboard = SentimentDashboardSchema.parse(parsed);

    const moodEmoji = { happy: "😊", stressed: "😰", neutral: "😐" };
    console.log(`\n${moodEmoji[dashboard.team_mood]} Estado: ${dashboard.team_mood.toUpperCase()}`);
    console.log(`⚠️ Bloqueador: ${dashboard.main_blocker}`);
    console.log(`🔴 Risco de Burnout: ${dashboard.burnout_risk ? "SIM" : "NÃO"}`);

    return dashboard;
  } catch (error) {
    console.error("❌ Erro na análise:", error.message);
    throw error;
  }
}

export function setupSentimentRoutes(app) {
  app.get("/exercises/dashboard/sentiment", async (req, res) => {
    try {
      const dashboard = await analyzeTeamSentiment();
      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ error: "Erro ao gerar dashboard de sentimento" });
    }
  });
}
