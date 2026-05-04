/**
 * Exercício 1: Chat de Suporte com Memória Persistente
 * Stream do Gemini + persistência em chat_history
 */

import { GoogleGenAI } from "@google/genai";
import { db } from "./database"; // Exemplo de importação da DB
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

  const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

async function chatSuportWithStream(userMessage, req, res) {
  try {
    // Configuração do modelo
  
    const model = await genAI.models({
      model: "gemini-2.5-flash-lite",
    });

    // Headers para Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    // Início do stream com o prompt focado em suporte ClickUp
    const result = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Age como suporte técnico do ClickUp. Pergunta: ${userMessage}`,
            },
          ],
        },
      ],
      generationConfig: { temperature: 0.4 },
    });

    // Iteração sobre os chunks do stream
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;

      console.log("Chunk recebido:", chunkText);

      // Envia para o cliente no formato SSE
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    // Persistência na Base de Dados após o fim do stream
    console.log("[DONE] A guardar no histórico...");

    
    await db.chat_history.create({
      data: {
        user_message: userMessage,
        ai_response: fullResponse,
        created_at: new Date()
      }
    });
    

    // Notifica o cliente do fim e encerra a ligação
    res.write(
      `data: ${JSON.stringify({ status: "completed", fullResponse })}\n\n`,
    );
    res.end();
  } catch (error) {
    console.error("Erro no chat com stream:", error);
    // Em SSE, erros devem ser passados como eventos ou fechando a conexão
    res.write(
      `data: ${JSON.stringify({ error: "Erro ao processar resposta" })}\n\n`,
    );
    res.end();
  }
}
