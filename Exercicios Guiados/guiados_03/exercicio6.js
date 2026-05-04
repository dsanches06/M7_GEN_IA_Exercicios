/**
 * Exercício 6: Sentiment Analysis Dashboard
 * Análise de múltiplos comentários e retorno estruturado
 */

import { GoogleGenAI } from "@google/genai"; // Sintaxe da escola
import { z } from "zod";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SentimentDashboardSchema = z.object({
  team_mood: z.enum(["happy", "stressed", "neutral"]),
  main_blocker: z.string(),
  burnout_risk: z.boolean(),
  recommendations: z.array(z.string()),
});

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
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analise os seguintes comentários de uma equipa e gere um relatório em JSON:
              ${commentsList}

              O JSON deve seguir este formato:
              {
                "team_mood": "happy" | "stressed" | "neutral",
                "main_blocker": "string",
                "burnout_risk": boolean,
                "recommendations": ["string"]
              }`
            }
          ]
        }
      ],
      generationConfig: { 
        temperature: 0.2,
        responseMimeType: "application/json" 
      },
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);
    const dashboard = SentimentDashboardSchema.parse(parsed);

    // Logs decorativos no terminal
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
  app.get("/dashboard/sentiment", async (req, res) => {
    try {
      const dashboard = await analyzeTeamSentiment();
      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ error: "Erro ao gerar dashboard de sentimento" });
    }
  });
}
