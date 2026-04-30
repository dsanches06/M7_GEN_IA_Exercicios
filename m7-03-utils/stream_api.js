import express from "express";
// Esta é a nova lib oficial (SDK Unificada v3)
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const app = express();

// Na v3, a inicialização é feita desta forma
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/chat-stream", async (req, res) => {
  // 1. Headers fundamentais para Streaming (SSE)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    const prompt = req.query.prompt || "Olá, Gemini 3!";

    // 2. Na v3, usamos ai.models.generateContentStream
    // O modelo é passado como o primeiro argumento da configuração
    const result = await ai.models.generateContentStream({
      model: "gemini-3-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // 3. Iteração sobre a stream
    // A v3 retorna um iterador assíncrono diretamente no objeto
    for await (const chunk of result.stream) {
      // Na nova SDK, o acesso ao texto é direto através de propriedades ou do método text()
      const chunkText = chunk.text();

      if (chunkText) {
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    // 4. Finalização
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Erro na SDK v3:", error);
    res.write(
      `data: ${JSON.stringify({ error: "Falha na conexão com Gemini 3" })}\n\n`,
    );
    res.end();
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 ClickBot v3 (@google/genai) em http://localhost:${PORT}`),
);
