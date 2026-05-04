/**
 * Exercício 2: Smart Task Parser (NLP para JSON)
 * Implementado com Zod v4 (Nativo) e Gemini
 */
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 1. Definir o Schema com Zod v4
const TaskSchema = z.object({
  title: z.string(),
  due_date: z.string(),
  priority: z.enum(["urgent", "high", "normal", "low"]),
  department: z.enum(["design", "dev", "marketing"]),
});

// 2. No Zod v4, o método é nativo da instância do schema
const schema = TaskSchema.toJSONSchema();

export async function parseTaskFromNaturalLanguage(userMessage) {
  try {
    // 3. Chamada ao Gemini seguindo a sintaxe solicitada
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite", // Verifique se esta versão está disponível no seu SDK
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Extraia os dados da tarefa desta mensagem: "${userMessage}"`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
        responseJsonSchema: schema, // O Zod v4 gera o schema compatível aqui
      },
    });

    const responseText = result.response.text();
    console.log("Resposta bruta do GenAI:", responseText);

    // 4. Parse do JSON e Validação Final
    const parsed = JSON.parse(responseText);

    // O .parse() do Zod garante que os dados seguem o contrato definido
    const validatedTask = TaskSchema.parse(parsed);

    console.log("Resposta validada com Zod:", validatedTask);
    return validatedTask;
  } catch (error) {
    // Tratamento de erros de parsing ou validação do Zod
    if (error instanceof z.ZodError) {
      console.error("❌ Erro de Validação Zod:", error.errors);
    } else {
      console.error("❌ Erro no Parser:", error.message);
    }
    throw error;
  }
}
