/**
 * Exercício 6: Sentiment Analysis Dashboard
 */
import { GoogleGenerativeAI } from "@google/generative-ai"; // 1. SDK Correto
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

// 1. Inicialização do Google GenAI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Definição do Schema com Zod
const SentimentDashboardSchema = z.object({
  team_mood: z.enum(["happy", "stressed", "neutral"]),
  main_blocker: z.string(),
  burnout_risk: z.boolean(),
  recommendations: z.array(z.string()),
});

// 3. Conversão para JSON Schema (que o Gemini entende)
const jsonSchema = zodToJsonSchema(SentimentDashboardSchema);

// 4. Configuração do Modelo
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
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

    // 5. Chamada ao modelo usando a instância 'model'
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analise o sentimento da equipa baseado nestes comentários e responda apenas em JSON:\n${commentsList}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1, // Menor temperatura para respostas mais estruturadas
        responseMimeType: "application/json",
        responseJsonSchema: jsonSchema,
      },
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    // Validação final dos dados com Zod
    const dashboard = SentimentDashboardSchema.parse(parsed);

    const moodEmoji = { happy: "😊", stressed: "😰", neutral: "😐" };
    console.log(
      `\n${moodEmoji[dashboard.team_mood]} Estado: ${dashboard.team_mood.toUpperCase()}`,
    );
    console.log(`⚠️ Bloqueador: ${dashboard.main_blocker}`);
    console.log(
      `🔴 Risco de Burnout: ${dashboard.burnout_risk ? "SIM" : "NÃO"}`,
    );

    return dashboard;
  } catch (error) {
    // Tratamento de erro detalhado
    console.error("❌ Erro na análise:", error.message);
    throw error;
  }
}

// Configuração das rotas Express
export function setupSentimentRoutes(app) {
  app.get("/exercises/dashboard/sentiment", async (req, res) => {
    try {
      const dashboard = await analyzeTeamSentiment();
      res.json(dashboard);
    } catch (error) {
      res.status(500).json({
        error: "Erro ao gerar dashboard de sentimento",
        details: error.message,
      });
    }
  });
}
