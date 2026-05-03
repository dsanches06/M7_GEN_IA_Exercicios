/**
 * Exercício 5: Smart Planner Semanal
 * Stream de raciocínio + JSON estruturado da agenda
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Schema para agenda estruturada (Zod continua aqui para validação lógica)
const ScheduleItemSchema = z.object({
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
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

// ❌ REMOVIDO: type WeeklyAgenda = z.infer<typeof WeeklyAgendaSchema>;

export async function planWeeklySchedule(userInput, req, res) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: { responseMimeType: "application/json" },
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const prompt = `
O utilizador quer organizar a sua semana: "${userInput}"

Gere uma resposta com:
1. Explicação do raciocínio
2. Uma agenda estruturada em JSON

Termine a sua resposta estritamente com o JSON entre as tags [JSON_START] e [JSON_END].
Formato do JSON:
{
  "reasoning": "string",
  "schedule": [{"day": "Monday", "time": "HH:MM", "task": "string", "duration_hours": number, "priority": "high|medium|low"}],
  "insights": "string"
}

[JSON_START]
    `;

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    // Extrair JSON da resposta
    const jsonMatch = fullResponse.match(
      /\[JSON_START\]([\s\S]*?)\[JSON_END\]/,
    );

    if (jsonMatch) {
      try {
        const rawJson = jsonMatch[1].trim();
        const scheduleJson = JSON.parse(rawJson);

        // Validação opcional com Zod para garantir integridade
        const validated = WeeklyAgendaSchema.parse(scheduleJson);

        res.write(
          `data: ${JSON.stringify({
            status: "completed",
            agenda: validated,
          })}\n\n`,
        );
      } catch (parseError) {
        console.error("Erro ao parsear JSON:", parseError);
        res.write(
          `data: ${JSON.stringify({ status: "error", message: "Erro no formato JSON" })}\n\n`,
        );
      }
    }

    res.end();
  } catch (error) {
    console.error("Erro no planner:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
}

export function setupPlannerRoutes(app) {
  app.post("/planner/weekly", async (req, res) => {
    const { tasks } = req.body;
    if (!tasks) return res.status(400).json({ error: "tasks é obrigatório" });
    await planWeeklySchedule(tasks, req, res);
  });
}
