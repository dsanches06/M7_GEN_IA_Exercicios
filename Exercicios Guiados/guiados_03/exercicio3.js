/**
 * Exercício 3: Transcritor de Reuniões em Tempo Real
 * Stream de análise + persistência em meeting_summaries
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function transcribeMeetingWithStream(meetingNotes, projectId, req, res) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Enviar indicador inicial
    res.write(`data: ${JSON.stringify({ status: "processing", message: "A processar pontos chave..." })}\n\n`);

    let fullSummary = "";

    const prompt = `
Analise as seguintes notas de reunião e gere um sumário executivo estruturado:

${meetingNotes}

Gere um sumário que inclua:
1. Principais pontos de decisão
2. Tarefas atribuídas
3. Próximos passos
4. Riscos ou preocupações identificadas
    `;

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Stream dos chunks
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullSummary += chunkText;
      console.log("Chunk processado:", chunkText);
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    // Sumário completo
    console.log("[DONE] Sumário de reunião gerado com sucesso");

    res.write(`data: ${JSON.stringify({ status: "completed", message: "Sumário gerado com sucesso", full_summary: fullSummary })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Erro no transcritor de reuniões:", error);
    res.status(500).json({ error: error.message });
  }
}

// Rota Express para usar
export function setupMeetingRoutes(app) {
  app.post("/meetings/transcribe", async (req, res) => {
    const { notes, project_id } = req.body;

    if (!notes) {
      return res.status(400).json({ error: "notes é obrigatório" });
    }

    await transcribeMeetingWithStream(notes, project_id || 1, req, res);
  });
}
