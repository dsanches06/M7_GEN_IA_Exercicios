/**
 * Exercício 1: Chat de Suporte com Memória Persistente
 * Stream do Gemini + persistência em chat_history
 */

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const BACKEND_URL = "http://localhost:3000";
const ROLE_USER = 2;    // USER
const ROLE_BOT = 3;     // MODEL/BOT

// Função auxiliar para fazer requisições HTTP
async function apiCall(method, endpoint, data = null) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${BACKEND_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`❌ API Call Failed (${endpoint}):`, error.message);
    throw error;
  }
}

export async function chatSuportWithStream(userMessage, req, res) {
  try {
    // Headers para Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // 1️⃣ Criar conversation via API
    const conversationData = await apiCall("POST", "/conversations/save", {
      title: `Chat Support - ${new Date().toISOString().split('T')[0]}`
    });
    const conversationId = conversationData.id;
    console.log("✅ Conversation criada:", conversationId);

    // 2️⃣ Guardar mensagem do utilizador via API
    await apiCall("POST", "/chat_history/save", {
      conversation_id: conversationId,
      role_id: ROLE_USER,
      content: userMessage
    });
    console.log("✅ Mensagem do user guardada");

    let fullResponse = "";

    // 3️⃣ Gerar resposta do bot via stream
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

    // 4️⃣ Guardar resposta completa do bot via API
    console.log("[DONE] A guardar resposta do bot...");
    await apiCall("POST", "/chat_history/save", {
      conversation_id: conversationId,
      role_id: ROLE_BOT,
      content: fullResponse
    });
    console.log("✅ Resposta do bot guardada");

    // Notifica o cliente do fim
    res.write(
      `data: ${JSON.stringify({ status: "completed", fullResponse, conversationId })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error("Erro no chat com stream:", error.message);
    res.write(
      `data: ${JSON.stringify({ error: error.message || "Erro ao processar resposta" })}\n\n`
    );
    res.end();
  }
}
