import { GoogleGenerativeAI } from "@google/generative-ai"; // 1. SDK Correto
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

// 2. Inicialização correta (API Key direto no constructor ou via config)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

const jsonSchema = zodToJsonSchema(WeeklyAgendaSchema);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function planWeeklySchedule(userInput, req, res) {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    // Prompt simplificado: O JSON Schema já define a estrutura, não precisas de tags manuais
    const prompt = `Organiza a seguinte semana de trabalho: "${userInput}".
    Explica o teu raciocínio no campo 'reasoning' e gera a agenda no campo 'schedule'.`;

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
        responseJsonSchema: jsonSchema, // O Gemini vai streamar o JSON aos poucos
      },
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      // Envia cada pedaço para o frontend
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    // Validação final após o stream terminar
    try {
      const validated = WeeklyAgendaSchema.parse(JSON.parse(fullResponse));
      res.write(
        `data: ${JSON.stringify({ status: "completed", agenda: validated })}\n\n`,
      );
    } catch (e) {
      res.write(
        `data: ${JSON.stringify({ status: "partial_success", raw: fullResponse })}\n\n`,
      );
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
