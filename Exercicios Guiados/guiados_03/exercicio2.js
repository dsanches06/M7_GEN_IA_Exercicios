/**
 * Exercício 2: Smart Task Parser (NLP para JSON)
 * Adaptado para a sintaxe: genAI.models.generateContent
 */
import { GoogleGenAI } from "@google/genai"; // Mantendo conforme o teu exemplo
import { z } from "zod";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const TaskSchema = z.object({
  title: z.string(),
  due_date: z.string(),
  priority: z.enum(["urgent", "high", "normal", "low"]),
  department: z.enum(["design", "dev", "marketing"]),
});

async function parseTaskFromNaturalLanguage(userMessage) {
  try {
    // Seguindo o padrão genAI.models.generateContent
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Extraia os dados da tarefa em JSON da seguinte mensagem: "${userMessage}". 
              Campos obrigatórios: 
              - title: string
              - due_date: string
              - priority: obrigatoriamente um destes (urgent, high, normal, low)
              - department: obrigatoriamente um destes (design, dev, marketing)
              
              Responde apenas o JSON puro, sem markdown ou explicações.`,
            },
          ],
        },
      ],
      generationConfig: { 
        temperature: 0.1, // Menor temperatura para maior precisão no JSON
        responseMimeType: "application/json" 
      },
    });

    // No padrão que mostraste, acedemos ao texto assim:
    const responseText = result.response.text();

    // Validar e transformar
    const parsed = JSON.parse(responseText);
    return TaskSchema.parse(parsed);

  } catch (error) {
    console.error("❌ Erro no Parser:", error.message);
    throw error;
  }
}
