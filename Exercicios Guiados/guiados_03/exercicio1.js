/**
 * Exercício 1: Chat de Suporte com Memória Persistente
 * Stream do Gemini + persistência em chat_history
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function chatSuportWithStream(userMessage, req, res) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
    });

    // Stream dos chunks
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      console.log("Chunk recebido:", chunkText);
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    // Stream terminou
    console.log("[DONE] Resposta completa obtida");

    res.write(`data: ${JSON.stringify({ status: "completed", message: "Chat concluído" })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Erro no chat com stream:", error);
    res.status(500).json({ error: error.message });
  }
}
