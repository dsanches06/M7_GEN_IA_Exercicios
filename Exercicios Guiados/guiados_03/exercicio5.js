/**
 * Exercício 5: Smart Planner Semanal
 * Stream de raciocínio + JSON estruturado da agenda
 */

import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const ScheduleItemSchema = z.object({
  day: z.enum([
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  ]),
  time: z.string(),
  task: z.string(),
  duration_hours: z.number().min(0.5),
  priority: z.enum(["high", "medium", "low"]),
});

const WeeklyAgendaSchema = z.object({
  reasoning: z.string(),
  schedule: z.array(ScheduleItemSchema),
  insights: z.string(),
});

const schema = z.toJSONSchema(WeeklyAgendaSchema);

export async function planWeeklySchedule(userInput, req, res) {
  try {
    // Configuração de headers SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const prompt = `
      O utilizador quer organizar a sua semana: "${userInput}"

      Gere uma resposta com:
      1. Explicação do raciocínio
      2. Uma agenda estruturada em JSON

      Importante: Coloque o JSON final entre as tags [JSON_START] e [JSON_END].
      Formato esperado:
      {
        "reasoning": "string",
        "schedule": [{"day": "Monday", "time": "HH:MM", "task": "string", "duration_hours": 1, "priority": "high"}],
        "insights": "string"
      }
    `;

    // Implementação seguindo o padrão da escola
    const result = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
        responseJsonSchema: schema,
      },
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;

      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    // Extrair JSON usando Regex
    const jsonMatch = fullResponse.match(/\[JSON_START\]([\s\S]*?)\[JSON_END\]/);

    if (jsonMatch) {
      try {
        const rawJson = jsonMatch[1].trim();
        const scheduleJson = JSON.parse(rawJson);
        const validated = WeeklyAgendaSchema.parse(scheduleJson);

        res.write(`data: ${JSON.stringify({ status: "completed", agenda: validated })}\n\n`);
      } catch (parseError) {
        console.error("Erro no parse do JSON:", parseError);
        res.write(`data: ${JSON.stringify({ status: "error", message: "JSON inválido gerado pela IA" })}\n\n`);
      }
    }

    res.end();
  } catch (error) {
    console.error("Erro no planner:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
}

export function setupPlannerRoutes(app) {
  app.post("/planner/weekly", async (req, res) => {
    const { tasks } = req.body;
    if (!tasks) return res.status(400).json({ error: "tasks é obrigatório" });
    await planWeeklySchedule(tasks, req, res);
  });
}
