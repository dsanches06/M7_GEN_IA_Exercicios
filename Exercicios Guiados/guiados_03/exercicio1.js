/**
 * Exercício 1: Chat de Suporte com Memória Persistente
 */

import { GoogleGenerativeAI } from "@google/generative-ai"; // 1. SDK Correto
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const BACKEND_URL = "http://localhost:3000";
const ROLE_USER = 2;
const ROLE_BOT = 3;

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

async function apiCall(method, endpoint, data = null) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(`${BACKEND_URL}${endpoint}`, options);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`❌ API Call Failed (${endpoint}):`, error.message);
    throw error;
  }
}

export async function chatSuportWithStream(userMessage, req, res) {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const result = await model.generateContentStream({
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

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    const titleResult = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Gera um título curto (máx 50 caracteres) para esta conversa:
              User: "${userMessage}"
              Bot: "${fullResponse.substring(0, 200)}"`,
            },
          ],
        },
      ],
      generationConfig: { temperature: 0.3 },
    });

    const conversationTitle =
      titleResult.response.text().trim() || "Chat Support";

    const conversationData = await apiCall("POST", "/conversations/save", {
      title: conversationTitle,
    });
    const conversationId = conversationData.id;

    await apiCall("POST", "/chat_history/save", {
      conversation_id: conversationId,
      role_id: ROLE_USER,
      content: userMessage,
    });

    await apiCall("POST", "/chat_history/save", {
      conversation_id: conversationId,
      role_id: ROLE_BOT,
      content: fullResponse,
    });

    res.write(
      `data: ${JSON.stringify({ status: "completed", conversationId, conversationTitle })}\n\n`,
    );
    res.end();
  } catch (error) {
    console.error("Erro no chat:", error.message);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
}
