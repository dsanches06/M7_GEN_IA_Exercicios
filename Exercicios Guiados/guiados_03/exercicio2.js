/**
 * Exercício 2: Smart Task Parser (NLP para JSON)
 * Corrigido para SDK Oficial e Gemini 2.0 Flash
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import dotenv from "dotenv";

// 1. Configuração do Ambiente
dotenv.config({ path: "../../.env" });

// Debug para confirmar se a chave está a ser lida
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Erro: GEMINI_API_KEY não encontrada no ficheiro .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Definição do Schema Zod
const TaskSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  due_date: z.string(), // Formato ISO solicitado no guia
  priority: z.enum(["urgent", "high", "normal", "low"]),
  department: z.enum(["design", "dev", "marketing"]),
});

// 3. Conversão para JSON Schema para o Gemini
const jsonSchema = zodToJsonSchema(TaskSchema);

// 4. Inicialização do Modelo (Recomendado: gemini-2.5-flash-lite para JSON estável)
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

/**
 * Função principal para processar linguagem natural
 */
export async function parseTaskFromNaturalLanguage(userMessage) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Hoje é dia ${today}. Extrai os dados da tarefa desta mensagem: "${userMessage}".
              Instruções:
              - 'title': Resumo curto da tarefa.
              - 'due_date': Data no formato ISO (YYYY-MM-DD).
              - 'priority' e 'department': Escolha as opções mais adequadas do schema.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1, // Baixa temperatura para maior precisão
        responseMimeType: "application/json",
        responseJsonSchema: jsonSchema,
      },
    });

    const responseText = result.response.text();
    
    // Parse e Validação com Zod
    const parsedData = JSON.parse(responseText);
    const validatedTask = TaskSchema.parse(parsedData);

    return validatedTask;

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Erro de Estrutura (Zod):", JSON.stringify(error.errors, null, 2));
    } else {
      console.error("❌ Erro na API Gemini:", error.message);
    }
    throw error;
  }
}
