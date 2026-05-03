/**
 * Exercício 2: Smart Task Parser (NLP para JSON)
 * Parse de mensagens informais em tarefas estruturadas
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const TaskSchema = z.object({
  title: z.string(),
  due_date: z.string(),
  priority: z.enum(["urgent", "high", "normal", "low"]),
  department: z.enum(["design", "dev", "marketing"]),
});

export async function parseTaskFromNaturalLanguage(userMessage) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      // Força o modelo a responder apenas em JSON
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Extraia os dados da tarefa em JSON: "${userMessage}". 
    Use o schema: {title, due_date, priority, department}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Validar e transformar
    const parsed = JSON.parse(responseText);
    return TaskSchema.parse(parsed);
  } catch (error) {
    console.error("❌ Erro:", error.message);
    throw error;
  }
}
